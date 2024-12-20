import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import CustomAlert from "./CustomAlert";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";

const EllipsisVertical = () => {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

  const toggleMenu = () => setVisible(!visible);
  const router = useRouter();

  const showAlert = (title, message, buttons) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleBackup = async () => {
    try {
      // Get builds
      const keys = await AsyncStorage.getAllKeys();
      const buildKeys = keys.filter((key) => key.startsWith("@buildConfig_"));
      if (buildKeys.length === 0) {
        showAlert("Error", "No builds to backup", [
          {
            label: "OK",
            onPress: () => console.log("No builds to backup"),
          },
        ]);
        return;
      }

      // Format data
      const builds = await AsyncStorage.multiGet(buildKeys);
      const buildsData = builds.map(([key, value]) => ({
        key,
        value: JSON.parse(value),
      }));

      // Create backup file
      const backupFileName = `RigBuilder_backup_${Date.now()}.json`;
      const filePath = `${FileSystem.documentDirectory}${backupFileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(buildsData, null, 2)
      );

      // Share file
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Save backup file",
        UTI: "public.json",
        saveToFiles: true,
      });

      toggleMenu();
    } catch (error) {
      console.error("Backup error:", error);
      showAlert("Error", `Backup failed: ${error.message}`, [
        {
          label: "OK",
          onPress: () => console.log("Backup failed"),
        },
      ]);
    }
  };

  const handleRestore = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (result.canceled) {
        return;
      }

      // leggi contenuto file
      const fileContent = await FileSystem.readAsStringAsync(
        result.assets[0].uri
      );
      const buildsData = JSON.parse(fileContent);

      for (const build of buildsData) {
        await AsyncStorage.setItem(build.key, JSON.stringify(build.value));
      }

      toggleMenu();
      showAlert("Success", "Builds restored successfully", [
        {
          label: "OK",
          onPress: () => console.log("Restore OK"),
        },
      ]);
    } catch (error) {
      console.error("Restore error:", error);
      showAlert("Error", "Failed to restore backup", [
        {
          label: "OK",
          onPress: () => console.log("Failed restore"),
        },
      ]);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          paddingRight: 20,
          paddingLeft: 30,
          paddingVertical: 10,
          zIndex: 10,
        }}
        onPressIn={() => {
          toggleMenu();
        }}
      >
        <FontAwesome5 name="ellipsis-v" size={24} color={Colors.dark.text} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu}>
          <View style={styles.menu}>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("about");
              }}
            >
              About
            </Text>
            <Text style={styles.menuItem} onPress={handleBackup}>
              Backup
            </Text>
            <Text style={styles.menuItem} onPress={handleRestore}>
              Restore
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.555)",
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "#757575e3",
    borderColor: "#ffffffc9",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  menuItem: {
    color: Colors.dark.text,
    fontSize: 18,
    paddingVertical: 15,
    textAlign: "center",
    fontFamily: "RigBuilderFontBold",
  },
});

export default EllipsisVertical;
