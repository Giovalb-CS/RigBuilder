import { View, Text, Button, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to About" onPress={() => router.push("/about")} />
    </SafeAreaView>
  );
}
