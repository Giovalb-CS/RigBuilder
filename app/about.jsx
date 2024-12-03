import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.theme.darkgrey,
      }}
    >
      <Text>About Us</Text>
      <Button
        title="Go Back"
        onPress={() => router.back()} // Torna alla schermata precedente
      />
    </View>
  );
}
