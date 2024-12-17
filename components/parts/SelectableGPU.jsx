import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import AnimatedIconButton from "../AnimatedIconButton";
import StarRating from "../StarRating";
import EventEmitter from "../../utils/EventEmitter";

export default function SelectablePart({ part }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    topContainer: {
      minHeight: isLandscape ? 80 : 80,
    },
    button: {
      flexBasis: isLandscape ? "13%" : "10%",
    },
  });

  const handleSelectGPU = (part) => {
    EventEmitter.emit("gpuSelected", part);
    router.back();
  };

  return (
    <View style={styles.part}>
      <View style={[styles.topContainer, dynamicStyles.topContainer]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: part.image_URL }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.partText}>
            {part.name.length > (isLandscape ? 40 : 60)
              ? part.name.substring(0, isLandscape ? 37 : 57).trim() + "..."
              : part.name}
          </Text>
        </View>
        <AnimatedIconButton
          iconFamily="Octicons"
          iconName="diff-added"
          buttonText=""
          onPress={() => handleSelectGPU(part)}
          style={[dynamicStyles.button, { borderRadius: 10 }]}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Rating</Text>
          <StarRating rating={part.rating} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.partText}>€{part.price}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>URL</Text>
          <Text
            style={[styles.partText, styles.link]}
            onPress={() => Linking.openURL(part.shop_URL)}
          >
            Link
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>TDP</Text>
          <Text style={styles.partText}>{part.tdp}W</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Memory</Text>
          <Text style={styles.partText}>{part.memory}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Memory clock</Text>
          <Text style={styles.partText}>{part.memory_clock}MHz</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Core clock</Text>
          <Text style={styles.partText}>{part.core_clock}MHz</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Boost clock</Text>
          <Text style={styles.partText}>{part.boost_clock}MHz</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Length</Text>
          <Text style={styles.partText}>{part.lenght}mm</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Slot width</Text>
          <Text style={styles.partText}>
            {part.slot_width}
            {part.slot_width && part.slot_width > 1 ? " Slots" : " Slot"}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Power cable</Text>
          <Text style={styles.partText}>{part.power_cable}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 1.3,
    borderColor: "#757575ff",
    borderRadius: 10,
    padding: 3,
    justifyContent: "space-around",
    alignItems: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
  bottomContainer: {
    flex: 1,
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  label: {
    textAlign: "center",
    color: Colors.theme.orange,
    fontSize: 16,
    fontFamily: "RigBuilderFontBold",
    textShadowColor: "rgba(0, 0, 0, 0.301)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 8,
  },
  part: {
    backgroundColor: "#757575ad",
    borderWidth: 1.5,
    borderColor: "#757575ff",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    flexDirection: "column",
    rowGap: 8,
  },
  nameContainer: {
    flexBasis: "55%",
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 1.3,
    borderColor: "#757575ff",
    borderRadius: 10,
    padding: 6,
    height: 80,
    justifyContent: "space-around",
  },
  partText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontFamily: "RigBuilderFont",
    textShadowColor: "rgba(0, 0, 0, 0.432)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    boxShadow: "3 3 2 2 rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
