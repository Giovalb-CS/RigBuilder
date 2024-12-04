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
  TextInput,
  Button,
  Switch,
  useWindowDimensions,
} from "react-native";
import Colors from "../constants/Colors";
import EllipsisVertical from "../components/EllipsisVertical";
import { MenuProvider } from "react-native-popup-menu";
import * as Font from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
  TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    style: [
      {
        fontFamily: "RigBuilderFont",
        color: Colors.dark.text,
        backgroundColor: Colors.dark.background,
        borderColor: Colors.theme.orange,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
      },
      TextInput.defaultProps?.style,
    ],
    placeholderTextColor: Colors.dark.text + "80", // 50% opacity
  };
  Button.defaultProps = {
    ...(Button.defaultProps || {}),
    color: Colors.theme.orange,
  };
  Switch.defaultProps = {
    ...(Switch.defaultProps || {}),
    trackColor: {
      false: Colors.dark.background,
      true: Colors.theme.orange,
    },
    thumbColor: Colors.dark.text,
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.theme.darkgrey,
      card: Colors.dark.background,
      text: Colors.dark.text,
      border: Colors.theme.orange,
    },
  };

  const styles = StyleSheet.create({
    logoContainer: {
      alignItems: "left",
      justifyContent: "center",
      width: isLandscape ? "30%" : 150,
    },
    logo: { width: isLandscape ? "100%" : 150, height: 50 },
  });

  return (
    <ThemeProvider value={CustomDarkTheme}>
      <MenuProvider>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={Colors.dark.background}
        />
        <Stack
          screenOptions={{
            headerShown: true,
            cardStyle: { backgroundColor: Colors.theme.darkgrey, flex: 1 },
          }}
        >
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
              title: "About RigBuilder",
              headerStyle: { backgroundColor: Colors.dark.background },
              headerTintColor: Colors.dark.text,
              headerTitleStyle: { fontFamily: "RigBuilderFontBold" },
            }}
          />
          <Stack.Screen
            name="(parts)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </MenuProvider>
    </ThemeProvider>
  );
}
