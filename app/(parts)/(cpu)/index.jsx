import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../../constants/Colors";
import Constants from "expo-constants";
import SelectablePart from "../../../components/parts/SelectablePart";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedIconButton from "../../../components/AnimatedIconButton";

export default function CPUScreen() {
  const { API_URL, API_KEY } = Constants.expoConfig.extra;
  const [cpus, setCPUs] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const scrollViewRef = useRef(null);
  const scrollY = new Animated.Value(0);

  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

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
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {error ? (
            <Text style={styles.error}>Error: {error}</Text>
          ) : cpus ? (
            cpus.map((cpu, index) => <SelectablePart key={index} part={cpu} />)
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.theme.orange} />
              <Text style={styles.loadingText}>Loading CPU data...</Text>
            </View>
          )}
        </ScrollView>
        <Animated.View
          style={[styles.scrollTopButton, { opacity: buttonOpacity }]}
        >
          <AnimatedIconButton
            iconFamily="FontAwesome5"
            iconName="arrow-alt-circle-up"
            buttonText=""
            onPress={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
            style={{ borderRadius: 10 }}
          />
        </Animated.View>
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
  scrollTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 2,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.dark.text,
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
