import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Colors from "../constants/Colors";

const IconComponents = {
  Octicons: require("@expo/vector-icons/Octicons").default,
  FontAwesome: require("@expo/vector-icons/FontAwesome").default,
  FontAwesome5: require("@expo/vector-icons/FontAwesome5").default,
  FontAwesome6: require("@expo/vector-icons/FontAwesome6").default,
  EvilIcons: require("@expo/vector-icons/EvilIcons").default,
};

export default function AnimatedIconButton({
  iconFamily = "Octicons",
  iconName,
  iconSize = 24,
  iconColor = Colors.button.buttonText,
  buttonText,
  onPress,
  style,
  // Add new color props with defaults
  initialBackgroundColor = Colors.popup.background,
  initialBorderColor = Colors.popup.border,
  pressedBackgroundColor = Colors.theme.orange,
  pressedBorderColor = Colors.theme.orange,
  initialElevation = 4,
  pressedElevation = 0,
}) {
  // Use props for initial values
  const backgroundColor = useSharedValue(initialBackgroundColor);
  const borderColor = useSharedValue(initialBorderColor);
  const elevation = useSharedValue(initialElevation);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(backgroundColor.value, { duration: 100 }),
      borderColor: withTiming(borderColor.value, { duration: 100 }),
      elevation: withTiming(elevation.value, { duration: 100 }),
    };
  });

  const IconComponent = IconComponents[iconFamily];

  return (
    <Animated.View style={[styles.button, animatedStyle, style]}>
      <Pressable
        style={styles.pressable}
        onPress={onPress}
        onPressIn={() => {
          backgroundColor.value = pressedBackgroundColor;
          borderColor.value = pressedBorderColor;
          elevation.value = pressedElevation;
        }}
        onPressOut={() => {
          backgroundColor.value = initialBackgroundColor;
          borderColor.value = initialBorderColor;
          elevation.value = initialElevation;
        }}
      >
        <Text style={styles.buttonText}>
          <IconComponent name={iconName} size={iconSize} color={iconColor} />
          {buttonText !== "" ? "\n" + buttonText : ""}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
    textAlign: "center",
  },
  pressable: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
