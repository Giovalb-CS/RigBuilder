import React from "react";
import { SafeAreaView, StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import Octicons from "@expo/vector-icons/Octicons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();

  // Shared values per colore e bordo
  const backgroundColor = useSharedValue(Colors.popup.background);
  const borderColor = useSharedValue(Colors.popup.border);
  const elevation = useSharedValue(4);

  // Stile animato per colore e bordo
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(backgroundColor.value, { duration: 100 }),
      borderColor: withTiming(borderColor.value, { duration: 100 }),
      elevation: withTiming(elevation.value, { duration: 100 }),
    };
  });

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <Text>Welcome to the Home Screen!</Text>
      <Animated.View style={[pageStyles.addButton, animatedStyle]}>
        <Pressable
          onPress={() => router.push("/about")}
          onPressIn={() => {
            backgroundColor.value = Colors.theme.orange;
            borderColor.value = Colors.theme.orange;
            elevation.value = 0;
          }}
          onPressOut={() => {
            backgroundColor.value = Colors.popup.background;
            borderColor.value = Colors.popup.border;
            elevation.value = 4;
          }}
        >
          <Text style={[commonStyles.buttonText, pageStyles.addButtonText]}>
            <Octicons
              name="diff-added"
              size={24}
              color={Colors.button.buttonText}
            />
            {"\nBuild"}
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const pageStyles = StyleSheet.create({
  addButton: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    textAlign: "center",
  },
});

const commonStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.theme.darkgrey,
  },
  buttonText: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
    textAlign: "center",
  },
});
