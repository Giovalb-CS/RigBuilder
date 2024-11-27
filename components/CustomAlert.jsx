import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const CustomAlert = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => {
                  button.onPress();
                  onClose(); // Chiude l'alert dopo aver premuto
                }}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: "80%",
    backgroundColor: Colors.popup.background,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.popup.border,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: Colors.dark.text,
    textShadowColor: "#0000004b",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3.84,
    elevation: 5,
    fontFamily: "RigBuilderFontBold",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.dark.text,
    textShadowColor: "#0000004b",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3.84,
    elevation: 5,
    fontFamily: "RigBuilderFont",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: Colors.theme.orange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RigBuilderFont",
  },
});

export default CustomAlert;
