import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text>Welcome to the Home Screen!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/about")}
      >
        <Text style={styles.buttonText}>Go to About</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.theme.darkgrey,
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
    color: Colors.theme.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RigBuilderFontBold",
  },
});
