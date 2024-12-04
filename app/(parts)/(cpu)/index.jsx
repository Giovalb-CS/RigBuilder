import React, { useState, useEffect } from "react"; // Add useState import
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../../constants/Colors";
import Constants from "expo-constants";
import SelectablePart from "../../../components/parts/SelectablePart";
import { LinearGradient } from "expo-linear-gradient";

export default function CPUScreen() {
  const { API_URL, API_KEY } = Constants.expoConfig.extra;
  const [cpus, setCPUs] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getCPU = async () => {
    try {
      const response = await fetch(API_URL + "/processors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCPUs(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching CPU data:", err);
    }
  };

  useEffect(() => {
    getCPU();
  }, []);

  return (
    <SafeAreaView style={[commonStyles.safeAreaView, { position: "relative" }]}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {error ? (
            <Text style={styles.error}>Error: {error}</Text>
          ) : cpus ? (
            cpus.map((cpu, index) => <SelectablePart key={index} part={cpu} />)
          ) : (
            <Text>Loading CPU data...</Text>
          )}
        </ScrollView>
        <LinearGradient
          colors={[Colors.theme.darkgrey, "transparent"]}
          style={styles.topFade}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", Colors.theme.darkgrey]}
          style={styles.bottomFade}
          pointerEvents="none"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginTop: 10,
  },
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 2,
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 2,
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
