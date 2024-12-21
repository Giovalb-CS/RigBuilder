import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import Colors from "../constants/Colors";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import AnimatedIconButton from "./AnimatedIconButton";
import Constants from "expo-constants";
import EventEmitter from "../utils/EventEmitter";

export default function AutomaticConfigurator() {
  const [budget, setBudget] = useState(1000);
  const [cpuBrand, setCpuBrand] = useState(null);

  const { API_URL, API_KEY } = Constants.expoConfig.extra;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAutoBuild = async () => {
    if (!cpuBrand) {
      setError("Please select a CPU brand");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/autobuild`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({
          price: budget,
          cpuBrand: cpuBrand,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Auto build result:", data);

      // Update components
      if (data.processor) EventEmitter.emit("cpuSelected", data.processor);
      if (data.gpu) EventEmitter.emit("gpuSelected", data.gpu);
      if (data.ram) EventEmitter.emit("ramSelected", data.ram);
      if (data.motherboard) EventEmitter.emit("moboSelected", data.motherboard);
      if (data.ssd) EventEmitter.emit("ssdSelected", data.ssd);
      if (data.cooler) EventEmitter.emit("coolerSelected", data.cooler);
      if (data.psu) EventEmitter.emit("psuSelected", data.psu);
      if (data.casebox) EventEmitter.emit("caseSelected", data.casebox);

      // Reset quantities
      EventEmitter.emit("quantitiesReset");
    } catch (err) {
      setError(err.message);
      console.error("Error auto building:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Automatic Configurator</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Budget: €{budget}</Text>
        <Slider
          style={styles.slider}
          minimumValue={900}
          maximumValue={5000}
          step={100}
          value={budget}
          onSlidingComplete={setBudget}
          minimumTrackTintColor={Colors.theme.orange}
          maximumTrackTintColor="#ffffff4d"
          thumbTintColor={Colors.theme.orange}
        />
      </View>

      <View style={styles.brandContainer}>
        <Text style={styles.label}>Select CPU Brand:</Text>
        <View style={styles.brandButtons}>
          <Pressable
            style={[
              styles.brandButton,
              cpuBrand === "amd" && styles.selectedBrand,
            ]}
            onPress={() => setCpuBrand("amd")}
          >
            <Octicons
              name="cpu"
              size={20}
              color={cpuBrand === "amd" ? Colors.theme.orange : "#fff"}
            />
            <Text style={styles.brandText}>AMD</Text>
          </Pressable>

          <Pressable
            style={[
              styles.brandButton,
              cpuBrand === "intel" && styles.selectedBrand,
            ]}
            onPress={() => setCpuBrand("intel")}
          >
            <Octicons
              name="cpu"
              size={20}
              color={cpuBrand === "intel" ? Colors.theme.orange : "#fff"}
            />
            <Text style={styles.brandText}>Intel</Text>
          </Pressable>
        </View>
      </View>

      <AnimatedIconButton
        iconFamily="FontAwesome6"
        iconName="screwdriver-wrench"
        iconSize={23}
        buttonText="Build"
        onPress={handleAutoBuild}
        style={styles.buildButton}
        initialBackgroundColor="#ffffff00"
        initialElevation={0}
        initialBorderColor="#ffffff4d"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "#ff3300",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "RigBuilderFont",
  },
  container: {
    backgroundColor: "#ffffff0d",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    color: Colors.theme.white,
    fontSize: 18,
    fontFamily: "RigBuilderFontBold",
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFont",
    marginBottom: 10,
    marginLeft: "5%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  brandContainer: {
    marginBottom: 20,
  },
  brandButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  brandButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 40,
    borderColor: "#ffffff4d",
    borderWidth: 1,
    width: "45%",
    justifyContent: "center",
    gap: 10,
  },
  selectedBrand: {
    borderColor: Colors.theme.orange,
    borderWidth: 1,
  },
  brandText: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFont",
  },
  buildButton: {
    width: "80%",
    borderRadius: 40,
    height: 60,
    margin: "auto",
  },
  buildButtonText: {
    color: Colors.theme.white,
    fontSize: 18,
    fontFamily: "RigBuilderFont",
    fontWeight: "bold",
  },
});
