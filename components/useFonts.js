import * as Font from "expo-font";

export const useFonts = async () => {
  await Font.loadAsync({
    "RigBuilderFont": require("../assets/fonts/static/Teachers-Regular.ttf"),
    "RigBuilderFontBold": require("../assets/fonts/static/Teachers-Bold.ttf"),
  });
};
