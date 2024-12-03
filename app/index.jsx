import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import AnimatedIconButton from "../components/AnimatedIconButton";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <Text>Welcome to the Home Screen!</Text>
      <AnimatedIconButton
        iconFamily="Octicons"
        iconName="diff-added"
        buttonText="Build"
        onPress={() => router.push("/(parts)")}
        style={{ position: "absolute", bottom: 20, right: 20 }}
      />
    </SafeAreaView>
  );
}

const pageStyles = StyleSheet.create({});

const commonStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.theme.darkgrey,
  },
});
