import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import AnimatedIconButton from "../components/AnimatedIconButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();
  const [builds, setBuilds] = useState([]);

  // Carico le build dall'AsyncStorage
  const loadBuilds = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const buildKeys = keys.filter((key) => key.startsWith("@buildConfig_"));
      const builds = await AsyncStorage.multiGet(buildKeys);
      setBuilds(
        builds.map(([key, value]) => ({
          id: key,
          ...JSON.parse(value),
        }))
      );
    } catch (error) {
      console.error("Error loading builds:", error);
    }
  };

  // useEffect non funzionava, mentre useFocusEffect si per react navigation
  useFocusEffect(
    useCallback(() => {
      loadBuilds();
    }, [])
  );

  // Componente per renderizzare ogni build
  const renderBuildItem = ({ item }) => {
    const componentImages = Object.values(item.components)
      .filter((component) => component !== null)
      .map((component) => component.image_URL);

    return (
      <TouchableOpacity
        style={pageStyles.buildItem}
        onPress={() => {
          const buildData = {
            id: item.id,
            name: item.name,
            components: item.components,
            quantities: item.quantities,
          };
          router.push({
            pathname: "/(parts)",
            params: { buildData: JSON.stringify(buildData) },
          });
        }}
      >
        <View>
          <Text style={pageStyles.buildName}>{item.name}</Text>
          <Text style={pageStyles.buildDate}>
            {new Date(item.savedAt).toLocaleDateString()}
          </Text>
        </View>
        <ScrollView
          horizontal
          style={styles.imagesScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {componentImages.map((image_URL, index) => (
            <Image
              key={index}
              source={{ uri: image_URL }}
              style={styles.componentImage}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </TouchableOpacity>
    );
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5
        name="plus"
        size={50}
        color={Colors.theme.orange}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>There are no builds yet!</Text>
      <Text style={styles.emptySubText}>
        Try creating a new one with the "+" button below.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <Text style={pageStyles.title}>Your Builds</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={builds}
          renderItem={renderBuildItem}
          keyExtractor={(item) => item.id}
          style={pageStyles.list}
          contentContainerStyle={pageStyles.listContent}
          ListEmptyComponent={EmptyListComponent}
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

      <View style={styles.warningContainer}>
        <Ionicons name="warning-outline" size={28} color={"#9c9c9cb7"} />
        <Text style={styles.noticeText}>
          Note: Data may not always be up-to-date. Please double-check before
          making any purchases.
        </Text>
      </View>

      <AnimatedIconButton
        iconFamily="Octicons"
        iconName="diff-added"
        buttonText="Build"
        onPress={() => router.push("/(parts)")}
        style={pageStyles.fab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
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
  noticeText: {
    color: "#9c9c9cb7",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "RigBuilderFont",
  },
  warningContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 90,
    borderWidth: 1,
    borderColor: "#9c9c9cb7",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginBottom: -1,
  },
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
  imagesScroll: {
    height: "auto",
    marginLeft: 10,
  },
  componentImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    backgroundColor: Colors.theme.white,
    borderRadius: 5,
  },
});

const pageStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: Colors.theme.orange,
    marginBottom: 20,
    fontFamily: "RigBuilderFontBold",
  },
  list: {
    width: "100%",
  },
  listContent: {
    padding: 10,
  },
  buildItem: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#757575ad",
    borderWidth: 1,
    borderColor: "#ffffffc9",
    borderRadius: 10,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buildName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "RigBuilderFontBold",
  },
  buildDate: {
    color: "#ffffff8d",
    fontSize: 14,
    fontFamily: "RigBuilderFont",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 3,
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
