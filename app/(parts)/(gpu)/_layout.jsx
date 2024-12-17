import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import Colors from "../../../constants/Colors";
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
            title: "Select a GPU",
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { fontFamily: "RigBuilderFontBold" },
          }}
        />
      </Stack>
    </>
  );
}
