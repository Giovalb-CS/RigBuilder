import React, { useState } from "react";
import { Text, Pressable, Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomAlert from "./CustomAlert";

export default function PartsButton({ title, icon, onPress }) {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

  const showInfo = () => {
    setAlertConfig({
      visible: true,
      title: `About ${title.substring(4)}`,
      message: getComponentInfo(title),
      buttons: [{ label: "OK", onPress: () => {} }],
    });
  };

  const getComponentInfo = (type) => {
    const info = {
      "Add CPU":
        "The CPU (Central Processing Unit) is the brain of your computer. It handles most calculations and coordinates system operations.",
      "Add GPU":
        "The GPU (Graphics Processing Unit) handles graphics rendering and computation. Essential for gaming and graphical workloads.",
      "Add RAM":
        "RAM (Random Access Memory) provides fast temporary storage for data that active programs need.",
      "Add MOBO":
        "The motherboard connects all components together and provides communication between different parts.",
      "Add SSD":
        "SSDs (Solid State Drives) provide storage for your system and files with faster access times than traditional hard drives.",
      "Add Cooler":
        "CPU coolers prevent overheating by removing heat from the processor.",
      "Add PSU":
        "The PSU (Power Supply Unit) provides power to all components in your system.",
      "Add Case":
        "The computer case houses and protects all components while providing airflow for cooling.",
    };
    return info[type] || "No information available";
  };

  return (
    <>
      <Pressable style={styles.partsButton} onPress={onPress}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.buttonText}>{title}</Text>
        <Pressable
          style={styles.infoButton}
          onPress={(e) => {
            e.stopPropagation();
            showInfo();
          }}
        >
          <FontAwesome5
            name="info-circle"
            size={24}
            color={Colors.theme.white}
          />
        </Pressable>
      </Pressable>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  infoButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 5,
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
});
