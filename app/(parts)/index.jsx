import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import AnimatedIconButton from "../../components/AnimatedIconButton";
import { LinearGradient } from "expo-linear-gradient";

const PartsButton = ({ title, icon, onPress }) => (
  <Pressable style={styles.partsButton} onPress={onPress}>
    <Image source={icon} style={styles.icon} resizeMode="contain" />
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const parts = [
  {
    title: "Add CPU",
    icon: require("../../assets/images/pc-parts-icons/cpu.png"),
    route: "/(parts)/(cpu)",
  },
  {
    title: "Add GPU",
    icon: require("../../assets/images/pc-parts-icons/gpu.png"),
    route: "/(parts)/(gpu)",
  },
  {
    title: "Add RAM",
    icon: require("../../assets/images/pc-parts-icons/ram.png"),
    route: "/(parts)/(ram)",
  },
  {
    title: "Add SSD",
    icon: require("../../assets/images/pc-parts-icons/ssd.png"),
    route: "/(parts)/(ssd)",
  },
  {
    title: "Add Motherboard",
    icon: require("../../assets/images/pc-parts-icons/motherboard.png"),
    route: "/(parts)/(motherboard)",
  },
  {
    title: "Add Cooler",
    icon: require("../../assets/images/pc-parts-icons/cooler.png"),
    route: "/(parts)/(cooler)",
  },
  {
    title: "Add PSU",
    icon: require("../../assets/images/pc-parts-icons/psu.png"),
    route: "/(parts)/(psu)",
  },
  {
    title: "Add Case",
    icon: require("../../assets/images/pc-parts-icons/casebox.png"),
    route: "/(parts)/(case)",
  },
];

export default function Configurator() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [tdp, setTdp] = useState(0);
  const [compatibility, setCompatibility] = useState("Compatible");

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
            {parts.map((part, index) => (
              <PartsButton
                key={index}
                title={part.title}
                icon={part.icon}
                onPress={() => router.push(part.route)}
              />
            ))}
            <AnimatedIconButton
              iconFamily="EvilIcons"
              iconName="check"
              iconSize={34}
              buttonText="Save"
              onPress={() => {}}
              style={styles.saveButton}
              initialBackgroundColor="#ffffff00"
              initialElevation={0}
            />
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
