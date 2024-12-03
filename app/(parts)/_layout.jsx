import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Colors from "../../constants/Colors";
import { MenuProvider } from "react-native-popup-menu";

export default function ConfiguratorLayout() {
  return (
    <MenuProvider>
      <Stack
        screenOptions={{
          cardStyle: { backgroundColor: Colors.theme.darkgrey, flex: 1 },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Configurator",
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { fontFamily: "RigBuilderFontBold" },
          }}
        />
      </Stack>
    </MenuProvider>
  );
}
