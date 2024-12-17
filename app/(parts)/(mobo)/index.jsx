import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "../../../constants/Colors";
import Constants from "expo-constants";
import SelectableMOBO from "../../../components/parts/SelectableMOBO";
import { LinearGradient } from "expo-linear-gradient";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import AnimatedIconButton from "../../../components/AnimatedIconButton";
import { Picker } from "@react-native-picker/picker";
import { AnimatedFlashList } from "@shopify/flash-list";
import { FontAwesome5 } from "@expo/vector-icons";

export default function MOBOScreen() {
  const { API_URL, API_KEY } = Constants.expoConfig.extra;
  const params = useLocalSearchParams();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [error, setError] = useState(null);

  const [mobos, setMOBOs] = useState(null);
  const [sockets, setSockets] = useState([]);
  const [chipsets, setChipsets] = useState([]);
  const [ramTypes, setRamTypes] = useState([]);
  const [formFactors, setFormFactors] = useState([]);

  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSocket, setSelectedSocket] = useState(params.socket || "");
  const [selectedChipset, setSelectedChipset] = useState("");
  const [selectedRamType, setSelectedRamType] = useState(params.ramType || "");
  const [selectedFormFactor, setSelectedFormFactor] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  const scrollViewRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterHeight = useRef(new Animated.Value(0)).current;

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterHeight, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getMOBO = async () => {
    try {
      const response = await fetch(API_URL + "/motherboards", {
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
      setMOBOs(data.motherboards);
      setSockets(data.sockets);
      setChipsets(data.chipsets);
      setRamTypes(data.ramTypes);
      setFormFactors(data.formFactors);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching MOBO data:", err);
    }
  };

  const postMOBO = async () => {
    try {
      setMOBOs(null);
      const filters = {
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(selectedSocket && { socket: selectedSocket }),
        ...(selectedChipset && { chipset: selectedChipset }),
        ...(selectedRamType && { ramType: selectedRamType }),
        ...(selectedFormFactor && { formFactor: selectedFormFactor }),
        ...(minRating && { minRating }),
        ...(maxRating && { maxRating }),
      };

      const response = await fetch(API_URL + "/motherboards/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMOBOs(data.motherboards);
      setSockets(data.sockets);
      setChipsets(data.chipsets);
      setRamTypes(data.ramTypes);
      setFormFactors(data.formFactors);
    } catch (err) {
      setError(err.message);
      console.error("Error applying advanced filters:", err);
    }
  };

  useEffect(() => {
    console.log("Initial params:", params);
    if (params.socket || params.ramType) {
      postMOBO();
    } else {
      getMOBO();
    }
  }, []);

  const handleNameSearch = async () => {
    try {
      setMOBOs(null);
      const response = await fetch(API_URL + "/motherboards/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ name: nameFilter }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMOBOs(data.motherboards);
      toggleFilters();
    } catch (err) {
      setError(err.message);
      console.error("Error applying name filter:", err);
    }
  };

  const handleSortChange = async (type, direction) => {
    try {
      setMOBOs(null);
      const params =
        type === "price" ? { priceSort: direction } : { ratingSort: direction };

      const response = await fetch(API_URL + "/motherboards/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMOBOs(data.motherboards);
      toggleFilters();
    } catch (err) {
      setError(err.message);
      console.error("Error applying sort:", err);
    }
  };

  const handleAdvancedSearch = async () => {
    try {
      setMOBOs(null);
      const filters = {
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(selectedSocket && { socket: selectedSocket }),
        ...(selectedChipset && { chipset: selectedChipset }),
        ...(selectedRamType && { ramType: selectedRamType }),
        ...(selectedFormFactor && { formFactor: selectedFormFactor }),
        ...(minRating && { minRating }),
        ...(maxRating && { maxRating }),
      };

      const response = await fetch(API_URL + "/motherboards/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMOBOs(data.motherboards);
      setSockets(data.sockets);
      setChipsets(data.chipsets);
      setRamTypes(data.ramTypes);
      setFormFactors(data.formFactors);
      toggleFilters();
    } catch (err) {
      setError(err.message);
      console.error("Error applying advanced filters:", err);
    }
  };

  const handleReset = () => {
    setMOBOs(null);
    setNameFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedSocket("");
    setSelectedChipset("");
    setSelectedRamType("");
    setSelectedFormFactor("");
    setMinRating("");
    setMaxRating("");
    getMOBO().then(() => {
      toggleFilters();
    });
  };

  function header() {
    return (
      <>
        <View style={styles.filterToggleContainer}>
          <AnimatedIconButton
            iconFamily="FontAwesome5"
            iconName={showFilters ? "chevron-up" : "chevron-down"}
            buttonText="Filters"
            iconSize={14}
            initialBackgroundColor="#ffffff00"
            initialBorderColor="#ffffff4d"
            initialElevation={0}
            onPress={() => toggleFilters()}
            style={styles.filterToggle}
          />
        </View>
        <Animated.View
          style={[
            styles.filterContainer,
            {
              maxHeight: filterHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000],
              }),
              opacity: filterHeight,
              overflow: "hidden",
            },
          ]}
        >
          <Text style={[styles.filterLabel, { width: "100%" }]}>
            Normal Search:
          </Text>
          {/* Name Search */}
          <View style={[{ width: "100%" }, styles.filterSection]}>
            <TextInput
              cursorColor={Colors.theme.orange}
              placeholder="Enter a motherboard brand or model"
              value={nameFilter}
              onChangeText={setNameFilter}
              style={[
                styles.input,
                focusedInput === "name" && {
                  borderColor: Colors.theme.orange,
                },
              ]}
              onPressIn={() => setFocusedInput("name")}
              onEndEditing={() => setFocusedInput(null)}
              placeholderTextColor={
                focusedInput === "name" ? Colors.theme.white : "#ffffff4d"
              }
            />
            <AnimatedIconButton
              iconFamily="FontAwesome5"
              iconName="search"
              buttonText="Search by name"
              iconSize={14}
              initialBackgroundColor="#ffffff00"
              initialElevation={0}
              initialBorderColor="#ffffff4d"
              onPress={handleNameSearch}
              style={styles.searchButton}
            />
          </View>

          {/* Sort Buttons */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Sort:</Text>
            <View style={styles.buttonGroup}>
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName="sort-amount-up"
                buttonText="Asc"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={() => handleSortChange("price", "asc")}
                style={[{ width: 70 }, styles.sortButton]}
              />
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName="sort-amount-down"
                buttonText="Desc"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={() => handleSortChange("price", "desc")}
                style={[{ width: 70 }, styles.sortButton]}
              />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Rating Sort:</Text>
            <View style={styles.buttonGroup}>
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName="sort-amount-up"
                buttonText="Asc"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={() => handleSortChange("rating", "asc")}
                style={[{ width: 70 }, styles.sortButton]}
              />
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName="sort-amount-down"
                buttonText="Desc"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={() => handleSortChange("rating", "desc")}
                style={[{ width: 70 }, styles.sortButton]}
              />
            </View>
          </View>

          {/* Advanced Search Form */}
          <View style={[{ width: "100%" }, styles.advancedFilterSection]}>
            <Text
              style={[styles.filterLabel, { width: "100%", marginBottom: 8 }]}
            >
              Advanced Search:
            </Text>
            <View style={styles.advancedForm}>
              <TextInput
                cursorColor={Colors.theme.orange}
                placeholder="Min Price"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                style={[
                  styles.input,
                  focusedInput === "minPrice" && {
                    borderColor: Colors.theme.orange,
                  },
                ]}
                onPressIn={() => setFocusedInput("minPrice")}
                onEndEditing={() => setFocusedInput(null)}
                placeholderTextColor={
                  focusedInput === "minPrice" ? Colors.theme.white : "#ffffff4d"
                }
              />
              <TextInput
                cursorColor={Colors.theme.orange}
                placeholder="Max Price"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                style={[
                  styles.input,
                  focusedInput === "maxPrice" && {
                    borderColor: Colors.theme.orange,
                  },
                ]}
                onPressIn={() => setFocusedInput("maxPrice")}
                onEndEditing={() => setFocusedInput(null)}
                placeholderTextColor={
                  focusedInput === "maxPrice" ? Colors.theme.white : "#ffffff4d"
                }
              />
              <View style={[styles.selectContainer]}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedSocket}
                    onValueChange={setSelectedSocket}
                    style={styles.picker}
                    onPressIn={() => setFocusedInput("socket")}
                    onEndEditing={() => setFocusedInput(null)}
                    dropdownIconColor={Colors.theme.white}
                  >
                    <Picker.Item label="Socket" value="" />
                    {sockets.map((socket) => (
                      <Picker.Item key={socket} label={socket} value={socket} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={[styles.selectContainer]}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedChipset}
                    onValueChange={setSelectedChipset}
                    style={styles.picker}
                    onPressIn={() => setFocusedInput("chipset")}
                    onEndEditing={() => setFocusedInput(null)}
                    dropdownIconColor={Colors.theme.white}
                  >
                    <Picker.Item label="Chipset" value="" />
                    {chipsets.map((chipset) => (
                      <Picker.Item
                        key={chipset}
                        label={chipset}
                        value={chipset}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.selectContainer}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedRamType}
                    onValueChange={setSelectedRamType}
                    style={styles.picker}
                    onPressIn={() => setFocusedInput("ramType")}
                    onEndEditing={() => setFocusedInput(null)}
                    dropdownIconColor={Colors.theme.white}
                  >
                    <Picker.Item label="RAM Type" value="" />
                    {ramTypes.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={[styles.selectContainer]}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedFormFactor}
                    onValueChange={setSelectedFormFactor}
                    style={styles.picker}
                    onPressIn={() => setFocusedInput("formFactor")}
                    onEndEditing={() => setFocusedInput(null)}
                    dropdownIconColor={Colors.theme.white}
                  >
                    <Picker.Item label="Form Factor" value="" />
                    {formFactors.map((formFactor) => (
                      <Picker.Item
                        key={formFactor}
                        label={formFactor}
                        value={formFactor}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <TextInput
                cursorColor={Colors.theme.orange}
                placeholder="Min Rating"
                value={minRating}
                onChangeText={setMinRating}
                keyboardType="numeric"
                style={[
                  styles.input,
                  focusedInput === "minRating" && {
                    borderColor: Colors.theme.orange,
                  },
                ]}
                onPressIn={() => setFocusedInput("minRating")}
                onEndEditing={() => setFocusedInput(null)}
                placeholderTextColor={
                  focusedInput === "minRating"
                    ? Colors.theme.white
                    : "#ffffff4d"
                }
              />
              <TextInput
                cursorColor={Colors.theme.orange}
                placeholder="Max Rating"
                value={maxRating}
                onChangeText={setMaxRating}
                keyboardType="numeric"
                style={[
                  styles.input,
                  focusedInput === "maxRating" && {
                    borderColor: Colors.theme.orange,
                  },
                ]}
                onPressIn={() => setFocusedInput("maxRating")}
                onEndEditing={() => setFocusedInput(null)}
                placeholderTextColor={
                  focusedInput === "maxRating"
                    ? Colors.theme.white
                    : "#ffffff4d"
                }
              />
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName="search"
                buttonText="Advanced Search"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={handleAdvancedSearch}
                style={styles.searchButton}
              />
            </View>
            <View style={styles.resetButtonContainer}>
              <AnimatedIconButton
                iconFamily="FontAwesome5"
                iconName={"redo"}
                buttonText="Reset"
                iconSize={14}
                initialBackgroundColor="#ffffff00"
                initialBorderColor="#ffffff4d"
                initialElevation={0}
                onPress={handleReset}
                style={styles.resetButton}
              />
            </View>
          </View>
        </Animated.View>
      </>
    );
  }

  function EmptyList() {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5
          name="search"
          size={50}
          color={Colors.theme.orange}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>No Motherboards found</Text>
        <Text style={styles.emptySubText}>
          Try adjusting your search filters
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.safeAreaView, { position: "relative" }]}>
      <View style={styles.container}>
        {error ? (
          <Text style={styles.error}>Error: {error}</Text>
        ) : mobos ? (
          <>
            <AnimatedFlashList
              ref={scrollViewRef}
              data={mobos}
              estimatedItemSize={200}
              renderItem={({ item }) => <SelectableMOBO part={item} />}
              contentContainerStyle={styles.scrollContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}
              bounces={true}
              overScrollMode="always"
              ListHeaderComponent={header()}
              ListEmptyComponent={EmptyList()}
            />
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.theme.orange} />
            <Text style={styles.loadingText}>Loading MOBO data...</Text>
          </View>
        )}
        <ScrollToTopButton
          scrollY={scrollY}
          onPress={() => {
            scrollViewRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.theme.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubText: {
    color: "#ffffff8a",
    fontSize: 14,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  resetButton: {
    alignSelf: "center",
    marginTop: 18,
    borderRadius: 50,
    height: 50,
    width: 156,
  },
  filterToggle: {
    alignSelf: "center",
    marginBottom: 10,
    width: 100,
    borderRadius: 50,
    height: 50,
  },
  filterContainer: {
    width: "100%",
    padding: 10,
    borderColor: "#ffffff4d",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterSection: {
    marginBottom: 15,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    flexGrow: 1,
  },
  advancedFilterSection: {
    marginBottom: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    flexGrow: 1,
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
    width: "auto",
    height: 50,
    minWidth: 150,
    maxWidth: 200,
    maxHeight: 50,
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
    width: "auto",
    paddingHorizontal: 20,
  },
  advancedForm: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  selectContainer: {},
  selectLabel: {
    color: Colors.dark.text,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "RigBuilderFontBold",
  },
  pickerContainer: {
    borderColor: "#ffffff4d",
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 160,
  },
  picker: {
    backgroundColor: "transparent",
    color: Colors.dark.text,
    height: 50,
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
