import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import Colors from "../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import CustomAlert from "./CustomAlert";

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
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                showAlert("Backup", "Backup function coming soon...", [
                  {
                    label: "OK",
                    onPress: () => console.log("Backup OK"),
                  },
                ]);
              }}
            >
              Backup
            </Text>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                showAlert("Restore", "Restore function coming soon...", [
                  {
                    label: "OK",
                    onPress: () => console.log("Restore OK"),
                  },
                ]);
              }}
            >
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
