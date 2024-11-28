import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import {
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import Colors from "../constants/Colors";
import EllipsisVertical from "../components/EllipsisVertical";
import { MenuProvider } from "react-native-popup-menu";
import * as Font from "expo-font";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RigBuilderFont: require("../assets/fonts/static/Teachers-Regular.ttf"),
        RigBuilderFontBold: require("../assets/fonts/static/Teachers-Bold.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.theme.darkgrey,
        }}
      >
        <ActivityIndicator size="large" color={Colors.theme.orange} />
      </View>
    );
  }

  // Sovrascrivi gli stili predefiniti di components
  Text.defaultProps = {
    ...(Text.defaultProps || {}),
    style: [
      { fontFamily: "RigBuilderFont", color: Colors.dark.text },
      Text.defaultProps?.style,
    ],
  };
  ActivityIndicator.defaultProps = {
    ...(ActivityIndicator.defaultProps || {}),
    color: Colors.theme.orange,
    size: "large",
  };
  SafeAreaView.defaultProps = {
    ...(SafeAreaView.defaultProps || {}),
    style: [
      { fontFamily: "RigBuilderFont", color: Colors.dark.text },
      SafeAreaView.defaultProps?.style,
    ],
  };

  return (
    <MenuProvider>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={Colors.dark.background}
      />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/RigBuilder_Logo_horizontal.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            ),
            headerRight: () => <EllipsisVertical />,
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { fontFamily: "RigBuilderFontBold" },
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About Us",
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { fontFamily: "RigBuilderFontBold" },
          }}
        />
      </Stack>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: { alignItems: "left", justifyContent: "center" },
  logo: { width: 150, height: 50 },
});
