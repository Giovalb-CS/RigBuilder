import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "../../constants/Colors";
import AnimatedIconButton from "../../components/AnimatedIconButton";
import { LinearGradient } from "expo-linear-gradient";
import PartsButton from "../../components/PartsButton";
import EventEmitter from "../../utils/EventEmitter";
import StarRating from "../../components/StarRating";

export default function Configurator() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

  // Build states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [tdp, setTdp] = useState(0);
  const [compatibility, setCompatibility] = useState("Compatible");
  // CPU states
  const [selectedCPU, setSelectedCPU] = useState(null);
  // GPU states
  const [selectedGPU, setSelectedGPU] = useState(null);
  // RAM states
  const [selectedRAM, setSelectedRAM] = useState(null);
  // MOBO states
  const [selectedMOBO, setSelectedMOBO] = useState(null);
  // SSD states
  const [selectedSSD, setSelectedSSD] = useState(null);
  // Cooler states
  const [selectedCooler, setSelectedCooler] = useState(null);
  // PSU states
  const [selectedPSU, setSelectedPSU] = useState(null);
  // Case states
  const [selectedCase, setSelectedCase] = useState(null);

  // Handle incoming selected component
  // Handle incoming selected components
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

  const handleRemoveCPU = () => {
    setSelectedCPU(null);
  };

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
                        ramType: selectedMOBO?.ramType,
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
                  ramType: selectedMOBO?.ramType,
                },
              })
            }
          />
        );
      // Add similar cases for other components
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <View>
        <Text>Price: €{price}</Text>
        <Text>Power: {tdp}W</Text>
        <Text>{compatibility}</Text>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            {["CPU", "GPU", "RAM", "MOBO", "SSD", "COOLER", "PSU", "CASE"].map(
              (type) => (
                <View key={type}>{renderPart(type)}</View>
              )
            )}
          </View>
        </ScrollView>
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
    flexDirection: "column",
    gap: 7,
  },
  actionButton: {
    width: 68,
    height: 48,
  },
  selectedComponent: {
    flexDirection: "row",
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
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.theme.darkgrey,
  },
});
