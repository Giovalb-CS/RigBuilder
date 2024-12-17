import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Colors from "../../constants/Colors";
import { MenuProvider } from "react-native-popup-menu";

export default function ConfiguratorLayout() {
  return (
    <>
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
        <Stack.Screen
          name="(cpu)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(gpu)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(ram)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(ssd)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(mobo)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(cooler)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(psu)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(case)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
