import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.icon}>
          <FontAwesome5
            name="info-circle"
            size={75}
            color={Colors.theme.lightGrey}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.paragraphTitle}>Description</Text>
          <Text style={styles.aboutText}>
            RigBuilder app is a configurator for PCs, it allows users to create
            and save custom configurations by choosing from a wide range of
            hardware components, keeping track of price, power consumption and
            compatibility between hardware components.
          </Text>

          <Text style={styles.subHeader}>
            The features offered by the app include:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>
              • Creation of custom configurations
            </Text>
            <Text style={styles.bulletPoint}>• Saving configurations</Text>
            <Text style={styles.bulletPoint}>
              • Monitoring component prices
            </Text>
            <Text style={styles.bulletPoint}>
              • Checking component compatibility
            </Text>
            <Text style={styles.bulletPoint}>
              • Calculating power consumption
            </Text>
            <Text style={styles.bulletPoint}>
              • Sharing configurations via scroll capture
            </Text>
          </View>

          <Text style={styles.paragraphTitle}>Privacy</Text>
          <Text style={styles.aboutText}>
            It is necessary to grant permissions to save configurations on the
            device and to access the memory to read and load them. The app is
            designed to not collect any personal information.
          </Text>

          <Text style={styles.paragraphTitle}>Development</Text>
          <Text style={styles.aboutText}>a</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.theme.darkgrey,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  icon: {
    alignItems: "left",
    padding: 18,
  },
  aboutText: {
    color: Colors.theme.white,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "RigBuilderFont",
  },
  subHeader: {
    color: Colors.theme.white,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    fontFamily: "RigBuilderFont",
  },
  bulletList: {
    paddingLeft: 16,
    gap: 8,
    marginBottom: 16,
  },
  bulletPoint: {
    color: Colors.theme.white,
    fontSize: 16,
    fontFamily: "RigBuilderFont",
  },
  paragraphTitle: {
    color: Colors.theme.orange,
    fontSize: 25,
    fontFamily: "RigBuilderFontBold",
  },
});
