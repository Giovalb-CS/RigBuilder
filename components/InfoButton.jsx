import React, { useState } from "react";
import { Pressable, StyleSheet, Linking } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import CustomAlert from "./CustomAlert";
import { LinearGradient } from "expo-linear-gradient";

export default function InfoButton({ component, type }) {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

  const getComponentInfo = (component, type) => {
    switch (type) {
      case "CPU":
        return (
          `TDP: ${component.tdp}W\n` +
          `Socket: ${component.socket}\n` +
          `RAM Type: ${component.ram_type}\n` +
          `Cores: ${component.core}\n` +
          `Threads: ${component.thread}\n` +
          `Base Clock: ${component.clock_base}GHz\n` +
          `Boost Clock: ${component.clock_boost}GHz` +
          `Cache: ${component.cache}\n` +
          `Scale: ${component.scale}nm\n` +
          `Generation: ${component.generation}`
        );
      case "GPU":
        return (
          `TDP: ${component.tdp}W\n` +
          `Memory: ${component.memory}\n` +
          `Memory Clock: ${component.memory_clock}MHz\n` +
          `Core Clock: ${component.core_clock}MHz\n` +
          `Boost Clock: ${component.boost_clock}MHz\n` +
          `Length: ${component.length}mm\n` +
          `Slot Width: ${component.slot_width} ${
            component.slot_width === 1 ? "Slot" : "Slots"
          }\n` +
          `Power Cable: ${component.power_cable}`
        );
      case "RAM":
        return (
          `TDP: ${component.tdp}W\n` +
          `Type: ${component.type}\n` +
          `Max clock: ${component.clock}MHz`
        );
      case "MOBO":
        return (
          `TDP: ${component.tdp}W\n` +
          `Socket: ${component.socket}\n` +
          `Chipset: ${component.chipset}\n` +
          `RAM Type: ${component.ram_type}\n` +
          `RAM max speed: ${component.ram_max_speed}MHz\n` +
          `RAM slots: ${component.ram_slot}\n` +
          `RAM max capacity: ${component.ram_max}GB\n` +
          `PCIe x16 slots: ${component.pcie_x16_slot}\n` +
          `PCIe x1 slots: ${component.pcie_x1_slot}\n` +
          `M.2 slots: ${component.m2_slot}\n` +
          `SATA slots: ${component.sata_slot}\n` +
          `LAN: ${component.lan}\n` +
          `Wi-Fi: ${component.wifi}\n` +
          `Form Factor: ${component.form_factor}`
        );
      case "SSD":
        return (
          `TDP: ${component.tdp}W\n` +
          `PCIe gen: ${component.pcie_gen}\n` +
          `Capacity: ${component.capacity}\n` +
          `Speed read: ${component.speed_read}MB/s\n` +
          `Speed write: ${component.speed_write}MB/s`
        );
      case "Cooler":
        return (
          `TDP: ${component.tdp}W\n` +
          `Socket: ${component.socket}\n` +
          `RPM: ${component.rpm}rpm\n` +
          `Noise level: ${component.noise_level}dB\n` +
          `${
            component.radiator_size > 0 && component.cooler_height <= 0
              ? `Radiator size: ${component.radiator_size}mm`
              : component.cooler_height > 0 && component.radiator_size <= 0
              ? `Cooler height: ${component.cooler_height}mm`
              : "Radiator size/Cooler height: Data error"
          }`
        );
      case "PSU":
        return (
          `Type: ${component.type}\n` +
          `Efficiency: ${component.efficiency}\n` +
          `Wattage: ${component.wattage}W\n` +
          `Length: ${component.lenght}mm`
        );
      case "Case":
        return (
          `Max Cooler Height: ${component.max_cooler_height}mm\n` +
          `Radiator Size: ${component.radiator_size}mm\n` +
          `Max GPU Length: ${component.gpu_lenght}mm\n` +
          `Form Factor: ${component.form_factor}\n` +
          `Max PSU Length: ${component.psu_lenght}mm\n` +
          `PCIe Slots: ${component.pcie_slots}`
        );
      default:
        return "No information available";
    }
  };

  const showInfo = () => {
    setAlertConfig({
      visible: true,
      title: component.name,
      message: getComponentInfo(component, type),
      buttons: [
        {
          label: "Shop Link",
          onPress: () => Linking.openURL(component.shop_URL),
        },
        {
          label: "Close",
          onPress: () => {},
        },
      ],
    });
  };

  return (
    <>
      <Pressable style={styles.infoButton} onPress={showInfo}>
        <LinearGradient
          colors={[
            "transparent",
            "transparent",
            "transparent",
            "#eb5f2802",
            "#eb5f285b",
            "#eb5f2869",
            "#eb5f28ad",
            "#eb5f28bd",
            "#eb5f28e3",
            "#eb5e28",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <FontAwesome5
            name="info-circle"
            size={26}
            color={Colors.theme.white}
          />
        </LinearGradient>
      </Pressable>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    padding: 4,
    paddingTop: 15,
    paddingLeft: 10,
    borderBottomRightRadius: 10,
  },
  infoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
