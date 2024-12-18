import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  useWindowDimensions,
  Linking,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "../../constants/Colors";
import AnimatedIconButton from "../../components/AnimatedIconButton";
import { LinearGradient } from "expo-linear-gradient";
import PartsButton from "../../components/PartsButton";
import EventEmitter from "../../utils/EventEmitter";
import StarRating from "../../components/StarRating";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackHandler, ToastAndroid } from "react-native";

export default function Configurator() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();
  const params = useLocalSearchParams();
  const [backPressedTime, setBackPressedTime] = useState(0);

  // Share states
  const [shareMode, setShareMode] = useState(false);
  const contentRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Saving states
  const [originalBuildId, setOriginalBuildId] = useState(null);

  // Share Handler
  const handleShare = async () => {
    try {
      setShareMode(true);
      setIsCapturing(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const uri = await captureRef(contentRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsCapturing(false);
      setShareMode(false);
    }
  };

  // Save handler
  const handleSaveBuild = async () => {
    try {
      if (originalBuildId) {
        await AsyncStorage.removeItem(originalBuildId);
        console.log("Deleted old build:", originalBuildId);
      }

      const buildConfig = {
        name,
        components: {
          cpu: selectedCPU,
          gpu: selectedGPU,
          ram: selectedRAM,
          mobo: selectedMOBO,
          ssd: selectedSSD,
          cooler: selectedCooler,
          psu: selectedPSU,
          case: selectedCase,
        },
        quantities: {
          cpu: cpuQuantity,
          gpu: gpuQuantity,
          ram: ramQuantity,
          mobo: moboQuantity,
          ssd: ssdQuantity,
          cooler: coolerQuantity,
          psu: psuQuantity,
          case: caseQuantity,
        },
        savedAt: Date.now(),
      };

      const buildId = `@buildConfig_${Date.now()}`;
      const jsonValue = JSON.stringify(buildConfig);
      await AsyncStorage.setItem(buildId, jsonValue);
      console.log("Build salvata con successo", buildId);
      router.back();
    } catch (e) {
      console.error("Errore durante il salvataggio", e);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      if (originalBuildId) {
        await AsyncStorage.removeItem(originalBuildId);
        console.log("Build deleted:", originalBuildId);
        router.back();
      }
    } catch (error) {
      console.error("Error deleting build:", error);
    }
  };

  // Build states
  const [name, setName] = useState("New Build");
  const [price, setPrice] = useState(0);
  const [tdp, setTdp] = useState(0);
  const [compatibility, setCompatibility] = useState("Compatible");
  // CPU states
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [cpuQuantity, setCpuQuantity] = useState(1);
  // GPU states
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [gpuQuantity, setGpuQuantity] = useState(1);
  // RAM states
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [ramQuantity, setRamQuantity] = useState(1);
  // MOBO states
  const [selectedMOBO, setSelectedMOBO] = useState(null);
  const [moboQuantity, setMoboQuantity] = useState(1);
  // SSD states
  const [selectedSSD, setSelectedSSD] = useState(null);
  const [ssdQuantity, setSsdQuantity] = useState(1);
  // Cooler states
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [coolerQuantity, setCoolerQuantity] = useState(1);
  // PSU states
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [psuQuantity, setPsuQuantity] = useState(1);
  // Case states
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseQuantity, setCaseQuantity] = useState(1);

  // Handlers selezione componenti
  useEffect(() => {
    const cpuHandler = (cpu) => {
      setSelectedCPU(cpu);
    };
    const gpuHandler = (gpu) => {
      setSelectedGPU(gpu);
    };
    const ramHandler = (ram) => {
      setSelectedRAM(ram);
    };
    const moboHandler = (mobo) => {
      setSelectedMOBO(mobo);
    };
    const ssdHandler = (ssd) => {
      setSelectedSSD(ssd);
    };
    const coolerHandler = (cooler) => {
      setSelectedCooler(cooler);
    };
    const psuHandler = (psu) => {
      setSelectedPSU(psu);
    };
    const caseHandler = (pcCase) => {
      setSelectedCase(pcCase);
    };

    EventEmitter.on("cpuSelected", cpuHandler);
    EventEmitter.on("gpuSelected", gpuHandler);
    EventEmitter.on("ramSelected", ramHandler);
    EventEmitter.on("moboSelected", moboHandler);
    EventEmitter.on("ssdSelected", ssdHandler);
    EventEmitter.on("coolerSelected", coolerHandler);
    EventEmitter.on("psuSelected", psuHandler);
    EventEmitter.on("caseSelected", caseHandler);

    return () => {
      // Pulizia dei listener
      EventEmitter.events["cpuSelected"] = [];
      EventEmitter.events["gpuSelected"] = [];
      EventEmitter.events["ramSelected"] = [];
      EventEmitter.events["moboSelected"] = [];
      EventEmitter.events["ssdSelected"] = [];
      EventEmitter.events["coolerSelected"] = [];
      EventEmitter.events["psuSelected"] = [];
      EventEmitter.events["caseSelected"] = [];
    };
  }, []);

  // Handlers modifiche
  useEffect(() => {
    // Nome
    const nameChangeHandler = (newName) => {
      setName(newName);
    };

    // Riapertura build
    const buildEditHandler = (buildData) => {
      try {
        if (buildData?.id) {
          setOriginalBuildId(buildData.id);
        }
        if (buildData?.name) {
          setName(buildData.name);
        }
        if (buildData?.components && buildData?.quantities) {
          const { components, quantities } = buildData;
          if (components.cpu) {
            setSelectedCPU(components.cpu);
            setCpuQuantity(quantities.cpu || 1);
          }
          if (components.gpu) {
            setSelectedGPU(components.gpu);
            setGpuQuantity(quantities.gpu || 1);
          }
          if (components.ram) {
            setSelectedRAM(components.ram);
            setRamQuantity(quantities.ram || 1);
          }
          if (components.mobo) {
            setSelectedMOBO(components.mobo);
            setMoboQuantity(quantities.mobo || 1);
          }
          if (components.ssd) {
            setSelectedSSD(components.ssd);
            setSsdQuantity(quantities.ssd || 1);
          }
          if (components.cooler) {
            setSelectedCooler(components.cooler);
            setCoolerQuantity(quantities.cooler || 1);
          }
          if (components.psu) {
            setSelectedPSU(components.psu);
            setPsuQuantity(quantities.psu || 1);
          }
          if (components.case) {
            setSelectedCase(components.case);
            setCaseQuantity(quantities.case || 1);
          }
        }
      } catch (error) {
        console.error("Error in buildEditHandler:", error);
      }
    };

    // Parse dei dati dalla homepage
    if (params.buildData) {
      try {
        const buildData = JSON.parse(params.buildData);
        buildEditHandler(buildData);
      } catch (error) {
        console.error("Error parsing initial build data:", error);
      }
    }

    EventEmitter.on("buildNameChanged", nameChangeHandler);
    EventEmitter.on("buildEdit", buildEditHandler);

    return () => {
      EventEmitter.events["buildEdit"] = [];
      EventEmitter.events["buildNameChanged"] = [];
    };
  }, [params.buildData]);

  // Handler indietro
  useEffect(() => {
    const backAction = () => {
      if (backPressedTime === 0) {
        setBackPressedTime(Date.now());
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        return true;
      }

      const now = Date.now();
      if (now - backPressedTime < 2000) {
        router.back();
        return true;
      }

      setBackPressedTime(now);
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backPressedTime]);

  // Handlers Bottoni Delete
  const handleRemoveCPU = () => {
    setSelectedCPU(null);
    setCpuQuantity(1);
  };
  const handleRemoveGPU = () => {
    setSelectedGPU(null);
    setGpuQuantity(1);
  };
  const handleRemoveRAM = () => {
    setSelectedRAM(null);
    setRamQuantity(1);
  };
  const handleRemoveMOBO = () => {
    setSelectedMOBO(null);
    setMoboQuantity(1);
  };
  const handleRemoveSSD = () => {
    setSelectedSSD(null);
    setSsdQuantity(1);
  };
  const handleRemoveCooler = () => {
    setSelectedCooler(null);
    setCoolerQuantity(1);
  };
  const handleRemovePSU = () => {
    setSelectedPSU(null);
    setPsuQuantity(1);
  };
  const handleRemoveCase = () => {
    setSelectedCase(null);
    setCaseQuantity(1);
  };

  // Handlers Quantita
  const handleCpuQuantityChange = (increment) => {
    setCpuQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleGpuQuantityChange = (increment) => {
    setGpuQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleRamQuantityChange = (increment) => {
    setRamQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleMoboQuantityChange = (increment) => {
    setMoboQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleSsdQuantityChange = (increment) => {
    setSsdQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleCoolerQuantityChange = (increment) => {
    setCoolerQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handlePsuQuantityChange = (increment) => {
    setPsuQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };
  const handleCaseQuantityChange = (increment) => {
    setCaseQuantity((prev) => {
      const newQuantity = prev + increment;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  };

  // Component render di una componente scelta, Share mode On e Off
  const renderPart = (type) => {
    switch (type) {
      case "CPU":
        if (selectedCPU) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedCPU.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedCPU.name.length > (isLandscape ? 40 : 60)
                      ? selectedCPU.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedCPU.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedCPU.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedCPU.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(cpu)",
                          params: {
                            socket: selectedMOBO?.socket,
                            ramType: selectedMOBO?.ram_type,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveCPU}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedCPU.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCpuQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{cpuQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCpuQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add CPU"
            icon={require("../../assets/images/pc-parts-icons/cpu.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(cpu)",
                params: {
                  socket: selectedMOBO?.socket,
                  ramType: selectedMOBO?.ram_type,
                },
              })
            }
          />
        );

      case "GPU":
        if (selectedGPU) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedGPU.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedGPU.name.length > (isLandscape ? 40 : 60)
                      ? selectedGPU.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedGPU.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedGPU.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedGPU.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(gpu)",
                          params: {
                            maxSlotWidth: selectedCase?.pcie_slots,
                            maxLength: selectedCase?.gpu_lenght,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveGPU}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedGPU.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleGpuQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{gpuQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleGpuQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add GPU"
            icon={require("../../assets/images/pc-parts-icons/gpu.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(gpu)",
                params: {
                  maxSlotWidth: selectedCase?.pcie_slots,
                  maxLength: selectedCase?.gpu_lenght,
                },
              })
            }
          />
        );

      case "RAM":
        if (selectedRAM) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedRAM.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedRAM.name.length > (isLandscape ? 40 : 60)
                      ? selectedRAM.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedRAM.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedRAM.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedRAM.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(ram)",
                          params: {
                            ramType: selectedCPU?.ram_type,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveRAM}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedRAM.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleRamQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{ramQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleRamQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add RAM"
            icon={require("../../assets/images/pc-parts-icons/ram.png")}
            onPress={() => {
              router.push({
                pathname: "/(parts)/(ram)",
                params: {
                  ramType: selectedCPU?.ram_type,
                },
              });
            }}
          />
        );

      case "MOBO":
        if (selectedMOBO) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedMOBO.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedMOBO.name.length > (isLandscape ? 40 : 60)
                      ? selectedMOBO.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedMOBO.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedMOBO.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedMOBO.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(mobo)",
                          params: {
                            socket: selectedCPU?.socket,
                            ramType: selectedRAM?.type,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveMOBO}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedMOBO.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleMoboQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{moboQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleMoboQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add MOBO"
            icon={require("../../assets/images/pc-parts-icons/motherboard.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(mobo)",
                params: {
                  socket: selectedCPU?.socket,
                  ramType: selectedRAM?.type,
                },
              })
            }
          />
        );

      case "SSD":
        if (selectedSSD) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedSSD.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedSSD.name.length > (isLandscape ? 40 : 60)
                      ? selectedSSD.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedSSD.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedSSD.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedSSD.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(ssd)",
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveSSD}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedSSD.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleSsdQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{ssdQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleSsdQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add SSD"
            icon={require("../../assets/images/pc-parts-icons/ssd.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(ssd)",
              })
            }
          />
        );

      case "COOLER":
        if (selectedCooler) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedCooler.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedCooler.name.length > (isLandscape ? 40 : 60)
                      ? selectedCooler.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedCooler.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedCooler.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedCooler.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(cooler)",
                          params: {
                            socket: selectedCPU?.socket,
                            max_cooler_height: selectedCase?.max_cooler_height,
                            radiator_size: selectedCase?.radiator_size,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveCooler}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedCooler.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCoolerQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{coolerQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCoolerQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add Cooler"
            icon={require("../../assets/images/pc-parts-icons/cooler.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(cooler)",
                params: {
                  socket: selectedCPU?.socket,
                  max_cooler_height: selectedCase?.max_cooler_height,
                  radiator_size: selectedCase?.radiator_size,
                },
              })
            }
          />
        );

      case "PSU":
        if (selectedPSU) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedPSU.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedPSU.name.length > (isLandscape ? 40 : 60)
                      ? selectedPSU.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedPSU.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedPSU.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedPSU.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(psu)",
                          params: {
                            minWattage: tdp,
                            maxLenght: selectedCase?.psu_lenght,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemovePSU}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedPSU.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handlePsuQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{psuQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handlePsuQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add PSU"
            icon={require("../../assets/images/pc-parts-icons/psu.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(psu)",
                params: {
                  minWattage: tdp,
                  maxLenght: selectedCase?.psu_lenght,
                },
              })
            }
          />
        );

      case "CASE":
        if (selectedCase) {
          return (
            <View style={styles.selectedComponent}>
              <View style={styles.partContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedCase.image_URL }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>
                    {selectedCase.name.length > (isLandscape ? 40 : 60)
                      ? selectedCase.name
                          .substring(0, isLandscape ? 37 : 57)
                          .trim() + "..."
                      : selectedCase.name}
                  </Text>
                  <View style={styles.componentRating}>
                    <StarRating rating={selectedCase.rating} />
                  </View>
                  <Text style={styles.componentPrice}>
                    €{selectedCase.price}
                  </Text>
                </View>
              </View>
              {!shareMode && (
                <>
                  <View style={styles.buttonsContainer}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="exchange-alt"
                      buttonText={"Swap"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={() =>
                        router.push({
                          pathname: "/(parts)/(case)",
                          params: {
                            minCoolerHeight: selectedCooler?.cooler_height,
                            minRadiatorSize: selectedCooler?.radiator_size,
                            minGPULenght: selectedGPU?.lenght,
                            formFactor: selectedMOBO?.form_factor,
                            minPSULenght: selectedPSU?.lenght,
                            minPCIeSlots: selectedGPU?.slot_width * gpuQuantity,
                          },
                        })
                      }
                      style={styles.actionButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText={"Delete"}
                      iconSize={16}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleRemoveCase}
                      style={styles.actionButton}
                    />
                  </View>
                  <View style={styles.bottomContainer}>
                    <Text
                      style={styles.componentLink}
                      onPress={() => Linking.openURL(selectedCase.shop_URL)}
                    >
                      Link
                    </Text>
                    <View style={styles.quantityContainer}>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="minus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCaseQuantityChange(-1)}
                        style={styles.quantityButton}
                      />
                      <Text style={styles.quantityText}>x{caseQuantity}</Text>
                      <AnimatedIconButton
                        iconFamily="FontAwesome5"
                        iconName="plus"
                        buttonText=""
                        iconSize={12}
                        initialBackgroundColor="#ffffff00"
                        initialBorderColor="#ffffff4d"
                        initialElevation={0}
                        onPress={() => handleCaseQuantityChange(1)}
                        style={styles.quantityButton}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <PartsButton
            title="Add Case"
            icon={require("../../assets/images/pc-parts-icons/casebox.png")}
            onPress={() =>
              router.push({
                pathname: "/(parts)/(case)",
                params: {
                  minCoolerHeight: selectedCooler?.cooler_height,
                  minRadiatorSize: selectedCooler?.radiator_size,
                  minGPULenght: selectedGPU?.lenght,
                  formFactor: selectedMOBO?.form_factor,
                  minPSULenght: selectedPSU?.lenght,
                  minPCIeSlots: selectedGPU?.slot_width * gpuQuantity,
                },
              })
            }
          />
        );
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <View style={styles.container}>
        {isCapturing ? (
          <View style={styles.scrollView} ref={contentRef} collapsable={false}>
            <View style={styles.buildInfoContainer}>
              <TextInput
                style={styles.buildNameInput}
                value={name}
                onChangeText={(text) => {
                  EventEmitter.emit("buildNameChanged", text);
                }}
                placeholder="Build Name"
                placeholderTextColor="#ffffff4d"
                cursorColor={Colors.theme.orange}
              />
              <View style={styles.buildStatsContainer}>
                <Text style={styles.buildStatsText}>Price: €{price}</Text>
                <Text style={styles.buildStatsText}>Power: {tdp}W</Text>
                <Text
                  style={[
                    styles.buildStatsText,
                    {
                      color:
                        compatibility === "Compatible" ? "#51ff00" : "#ff3300",
                    },
                  ]}
                >
                  {compatibility}
                </Text>
              </View>
              {!shareMode && (
                <>
                  {originalBuildId && (
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText=""
                      iconSize={20}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleDelete}
                      style={styles.deleteButton}
                    />
                  )}
                  <AnimatedIconButton
                    iconFamily="FontAwesome5"
                    iconName="share-alt"
                    buttonText=""
                    iconSize={20}
                    initialBackgroundColor="#ffffff00"
                    initialBorderColor="#ffffff4d"
                    initialElevation={0}
                    onPress={handleShare}
                    style={styles.shareButton}
                  />
                  <AnimatedIconButton
                    iconFamily="FontAwesome5"
                    iconName="save"
                    buttonText=""
                    iconSize={24}
                    initialBackgroundColor="#ffffff00"
                    initialBorderColor="#ffffff4d"
                    initialElevation={0}
                    onPress={handleSaveBuild}
                    style={styles.saveBuildButton}
                  />
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              {[
                "CPU",
                "GPU",
                "RAM",
                "MOBO",
                "SSD",
                "COOLER",
                "PSU",
                "CASE",
              ].map((type) => (
                <View key={type}>{renderPart(type)}</View>
              ))}
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              justifyContent: "space-around",
            }}
          >
            <View style={styles.buildInfoContainer}>
              <TextInput
                style={styles.buildNameInput}
                value={name}
                onChangeText={(text) => {
                  EventEmitter.emit("buildNameChanged", text);
                }}
                placeholder="Build Name"
                placeholderTextColor="#ffffff4d"
                cursorColor={Colors.theme.orange}
              />
              <View style={styles.buildStatsContainer}>
                <Text style={styles.buildStatsText}>Price: €{price}</Text>
                <Text style={styles.buildStatsText}>Power: {tdp}W</Text>
                <Text
                  style={[
                    styles.buildStatsText,
                    {
                      color:
                        compatibility === "Compatible" ? "#51ff00" : "#ff3300",
                    },
                  ]}
                >
                  {compatibility}
                </Text>
              </View>
              {!shareMode && (
                <>
                  {originalBuildId && (
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="trash"
                      buttonText=""
                      iconSize={20}
                      initialBackgroundColor="#ffffff00"
                      initialBorderColor="#ffffff4d"
                      initialElevation={0}
                      onPress={handleDelete}
                      style={styles.deleteButton}
                    />
                  )}
                  <AnimatedIconButton
                    iconFamily="FontAwesome5"
                    iconName="share-alt"
                    buttonText=""
                    iconSize={20}
                    initialBackgroundColor="#ffffff00"
                    initialBorderColor="#ffffff4d"
                    initialElevation={0}
                    onPress={handleShare}
                    style={styles.shareButton}
                  />
                  <AnimatedIconButton
                    iconFamily="FontAwesome5"
                    iconName="save"
                    buttonText=""
                    iconSize={24}
                    initialBackgroundColor="#ffffff00"
                    initialBorderColor="#ffffff4d"
                    initialElevation={0}
                    onPress={handleSaveBuild}
                    style={styles.saveBuildButton}
                  />
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              {[
                "CPU",
                "GPU",
                "RAM",
                "MOBO",
                "SSD",
                "COOLER",
                "PSU",
                "CASE",
              ].map((type) => (
                <View key={type}>{renderPart(type)}</View>
              ))}
            </View>
          </ScrollView>
        )}
        <LinearGradient
          colors={[Colors.theme.darkgrey, "transparent"]}
          style={styles.topFade}
        />
        <LinearGradient
          colors={["transparent", Colors.theme.darkgrey]}
          style={styles.bottomFade}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    position: "absolute",
    right: 124,
    top: 77,
    width: 50,
    height: 50,
  },
  saveBuildButton: {
    position: "absolute",
    right: 16,
    top: 77,
    width: 50,
    height: 50,
  },
  shareButton: {
    position: "absolute",
    right: 70,
    top: 77,
    width: 50,
    height: 50,
  },
  buildInfoContainer: {
    padding: 16,
    backgroundColor: "#757575ad",
    borderRadius: 10,
    width: "100%",
  },
  buildNameInput: {
    color: Colors.theme.white,
    fontSize: 24,
    fontFamily: "RigBuilderFontBold",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff4d",
    marginBottom: 16,
    maxHeight: 49,
  },
  buildStatsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "left",
  },
  buildStatsText: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFont",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
  },
  quantityText: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
  },
  componentLink: {
    textDecorationLine: "underline",
    color: Colors.theme.white,
    borderWidth: 1,
    borderColor: "#ffffffc9",
    borderRadius: 10,
    width: 40,
    padding: 5,
    textAlign: "center",
  },
  bottomContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    boxShadow: "3 3 2 2 rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  partContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    gap: 8,
  },
  buttonsContainer: {
    width: "18.3%",
    flexDirection: "column",
    gap: 7,
  },
  actionButton: {
    width: 68,
    height: 48,
  },
  selectedComponent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#757575e3",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffffc9",
    boxShadow: "8 7 4 4 rgba(0, 0, 0, 0.2)",
    gap: 5,
  },
  componentImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: "RigBuilderFont",
    textShadowColor: "rgba(0, 0, 0, 0.432)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  componentPrice: {
    color: Colors.theme.orange,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
    textShadowColor: "rgba(0, 0, 0, 0.301)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  swapButton: {
    width: 60,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    width: "100%",
    paddingVertical: 9,
  },
  buttonContainer: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 10,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1,
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1,
  },
  partsButton: {
    backgroundColor: "#757575e3",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffffc9",
    gap: 10,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
    textAlign: "center",
  },
  icon: {
    width: 35,
    height: 35,
  },
  saveButton: {
    marginTop: 8,
    width: "auto",
    borderRadius: 50,
    marginHorizontal: 50,
  },
});

const commonStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: Colors.theme.darkgrey,
  },
});
