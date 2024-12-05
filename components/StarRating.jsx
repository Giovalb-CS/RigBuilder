import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default function StarRating({ rating }) {
  const stars = [];
  const totalStars = 5;
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= totalStars; i++) {
    let starIcon;
    if (i <= Math.floor(roundedRating)) {
      starIcon = "star";
    } else if (i - 0.5 === roundedRating) {
      starIcon = "star-half-o";
    } else {
      starIcon = "star-o";
    }

    stars.push(
      <FontAwesome
        key={i}
        name={starIcon}
        size={14}
        color={"#ffffffde"}
        style={{ marginRight: 1 }}
      />
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flexDirection: "row" }}>{stars}</View>
      <Text style={[styles.partText, { marginLeft: 5 }]}>({rating})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  partText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: "RigBuilderFont",
    textShadowColor: "rgba(0, 0, 0, 0.432)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
});
