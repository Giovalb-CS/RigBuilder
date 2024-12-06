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
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../../constants/Colors";
import Constants from "expo-constants";
import SelectablePart from "../../../components/parts/SelectablePart";
import { LinearGradient } from "expo-linear-gradient";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import AnimatedIconButton from "../../../components/AnimatedIconButton";
import { Picker } from "@react-native-picker/picker";

export default function CPUScreen() {
  const { API_URL, API_KEY } = Constants.expoConfig.extra;
  const [cpus, setCPUs] = useState(null);
  const [sockets, setSockets] = useState([]);
  const [ramTypes, setRamTypes] = useState([]);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSocket, setSelectedSocket] = useState("");
  const [selectedRamType, setSelectedRamType] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
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
      setCPUs(data.processors);
      setSockets(data.sockets);
      setRamTypes(data.ramTypes);
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
            <>
              <View style={styles.filterContainer}>
                {/* Name Search */}
                <View style={styles.filterSection}>
                  <TextInput
                    placeholder="Search by name..."
                    value={nameFilter}
                    onChangeText={setNameFilter}
                    style={styles.input}
                    placeholderTextColor={"#ffffff4d"}
                  />
                  <AnimatedIconButton
                    iconFamily="FontAwesome5"
                    iconName="search"
                    buttonText="Search"
                    iconSize={14}
                    initialBackgroundColor="#ffffff00"
                    initialElevation={0}
                    onPress={() => {
                      /* handle name search */
                    }}
                    style={styles.searchButton}
                  />
                </View>

                {/* Sort Buttons */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Price Sort:</Text>
                  <View style={styles.buttonGroup}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="sort-amount-down"
                      buttonText="Asc"
                      iconSize={14}
                      initialBackgroundColor="#ffffff00"
                      initialElevation={0}
                      onPress={() => {
                        /* handle price asc */
                      }}
                      style={styles.sortButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="sort-amount-up"
                      buttonText="Desc"
                      iconSize={14}
                      initialBackgroundColor="#ffffff00"
                      initialElevation={0}
                      onPress={() => {
                        /* handle price desc */
                      }}
                      style={styles.sortButton}
                    />
                  </View>
                </View>

                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Rating Sort:</Text>
                  <View style={styles.buttonGroup}>
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="sort-amount-down"
                      buttonText="Asc"
                      iconSize={14}
                      initialBackgroundColor="#ffffff00"
                      initialElevation={0}
                      onPress={() => {
                        /* handle rating asc */
                      }}
                      style={styles.sortButton}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="sort-amount-up"
                      buttonText="Desc"
                      iconSize={14}
                      initialBackgroundColor="#ffffff00"
                      initialElevation={0}
                      onPress={() => {
                        /* handle rating desc */
                      }}
                      style={styles.sortButton}
                    />
                  </View>
                </View>

                {/* Advanced Search Form */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Advanced Search:</Text>
                  <View style={styles.advancedForm}>
                    <TextInput
                      placeholder="Min Price"
                      value={minPrice}
                      onChangeText={setMinPrice}
                      keyboardType="numeric"
                      style={styles.input}
                      placeholderTextColor={"#ffffff4d"}
                    />
                    <TextInput
                      placeholder="Max Price"
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                      keyboardType="numeric"
                      style={styles.input}
                      placeholderTextColor={"#ffffff4d"}
                    />
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectLabel}>Socket:</Text>
                      <Picker
                        selectedValue={selectedSocket}
                        onValueChange={setSelectedSocket}
                        style={styles.picker}
                      >
                        <Picker.Item label="All" value="" />
                        {sockets.map((socket) => (
                          <Picker.Item
                            key={socket}
                            label={socket}
                            value={socket}
                          />
                        ))}
                      </Picker>
                    </View>
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectLabel}>RAM Type:</Text>
                      <Picker
                        selectedValue={selectedRamType}
                        onValueChange={setSelectedRamType}
                        style={styles.picker}
                        borderRadius={10}
                        borderColor="#ffffffff"
                        borderWidth={1}
                      >
                        <Picker.Item label="All" value="" />
                        {ramTypes.map((type) => (
                          <Picker.Item key={type} label={type} value={type} />
                        ))}
                      </Picker>
                    </View>
                    <TextInput
                      placeholder="Min Rating"
                      value={minRating}
                      onChangeText={setMinRating}
                      keyboardType="numeric"
                      style={styles.input}
                      placeholderTextColor={"#ffffff4d"}
                    />
                    <TextInput
                      placeholder="Max Rating"
                      value={maxRating}
                      onChangeText={setMaxRating}
                      keyboardType="numeric"
                      style={styles.input}
                      placeholderTextColor={"#ffffff4d"}
                    />
                    <AnimatedIconButton
                      iconFamily="FontAwesome5"
                      iconName="search"
                      buttonText="Search"
                      iconSize={14}
                      initialBackgroundColor="#ffffff00"
                      initialElevation={0}
                      onPress={() => {
                        /* handle advanced search */
                      }}
                      style={styles.searchButton}
                    />
                  </View>
                </View>
              </View>
              {cpus.map((cpu, index) => (
                <SelectablePart key={index} part={cpu} />
              ))}
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.theme.orange} />
              <Text style={styles.loadingText}>Loading CPU data...</Text>
            </View>
          )}
        </ScrollView>
        <ScrollToTopButton
          scrollY={scrollY}
          onPress={() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }}
        />
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
  filterContainer: {
    width: "100%",
    position: "relative",
    padding: 10,
    borderColor: "#ffffff4d",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  filterSection: {
    marginBottom: 15,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterLabel: {
    color: Colors.dark.text,
    fontFamily: "RigBuilderFontBold",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    borderColor: "#ffffff4d",
    borderWidth: 1,
    color: Colors.dark.text,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 50,
  },
  searchButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 50,
  },
  advancedForm: {
    gap: 10,
  },
  selectContainer: {
    marginBottom: 10,
  },
  selectLabel: {
    color: Colors.dark.text,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "RigBuilderFontBold",
  },
  picker: {
    backgroundColor: "transparent",
    color: Colors.dark.text,
  },
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
