import React, { useState } from "react";
import { Text, Pressable, Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default function PartsButton({ title, icon, onPress }) {
  return (
    <Pressable style={styles.partsButton} onPress={onPress}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
