// components/ScrollToTopButton.jsx
import React from "react";
import { Animated, StyleSheet } from "react-native";
import AnimatedIconButton from "./AnimatedIconButton";
import Colors from "../constants/Colors";

export default function ScrollToTopButton({ scrollY, onPress, style }) {
  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.scrollTopButton, { opacity: buttonOpacity }, style]}
    >
      <AnimatedIconButton
        iconFamily="FontAwesome5"
        iconName="arrow-alt-circle-up"
        buttonText=""
        onPress={onPress}
        style={{ borderRadius: 10 }}
        initialElevation={0}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 2,
  },
});
