import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import AnimatedLogo from "../components/AnimatedLogo";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingVertical: 50 }}
      >
        <View
          style={[
            styles.animatedLogoContainer,
            { transform: [{ translateY: -50 }] },
          ]}
        >
          <AnimatedLogo width={200} height={200} />
        </View>

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
          <Text style={styles.aboutText}>
            The main goal is to help beginners take their first steps into PC
            building. We guide users through component selection while
            automatically checking compatibility, making the complex world of PC
            hardware more approachable for newcomers.
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
              • Checking component compatibility
            </Text>
            <Text style={styles.bulletPoint}>
              • Calculating total build power consumption and price
            </Text>
            <Text style={styles.bulletPoint}>
              • Sharing configurations via scroll capture
            </Text>
            <Text style={styles.bulletPoint}>
              • Automatic build configurations based on a price budget and user
              preferences
            </Text>
          </View>

          <Text style={styles.paragraphTitle}>Privacy</Text>
          <Text style={styles.aboutText}>
            It is necessary to grant permissions to save configurations on the
            device and to access the memory to read and load them. The app is
            designed to not collect any personal information.
          </Text>

          <Text style={styles.paragraphTitle}>Development</Text>
          <Text style={styles.aboutText}>
            RigBuilder was developed using React Native for a fluid and
            multiplatform user experience, and Expo framework for a fast
            prototyping and deployment. The app uses the AsyncStorage API to
            store configurations on the device.
          </Text>
          <Text style={styles.aboutText}>
            The data displayed in the app is fetched from the server via
            endpoints of the REST API. The server also hosts the administrator
            dashboard for managing the hardware components. The data is obtained
            from various web sources via some python web scraper scripts.
          </Text>

          <Text style={styles.paragraphTitle}>Project context</Text>
          <Text style={styles.aboutText}>
            This project was realized as part of my thesis in Computer Science
            at the University of Salerno. It represents an important milestone
            in my academic journey and allowed me to put into practice the
            skills acquired during my degree, especially in mobile development,
            user interface design, and graphics.
          </Text>

          <Text style={styles.paragraphTitle}>Future expansions</Text>
          <Text style={styles.aboutText}>
            In the future, RigBuilder could include features{"\n"}
            <Text style={styles.subHeader}>such as:</Text>
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>
              • Advanced configuration support, such as RAID and SLI
            </Text>
            <Text style={styles.bulletPoint}>
              • More component types and peripherals, such as monitors, audio
              cards, network cards, mouses, keyboards, custom water loops,
              etc...
            </Text>
            <Text style={styles.bulletPoint}>
              • Integration and collaborations with online or local stores to
              purchase components
            </Text>
          </View>

          <Text style={styles.paragraphTitle}>Contacts</Text>
          <Text style={styles.aboutText}>
            For any questions, feedback, or collaboration proposals, you can
            contact me at the following email address:
          </Text>
          <Text
            style={[styles.aboutText, styles.email]}
            onPress={() =>
              Linking.openURL("mailto:giovanni.bonacci.cs@gmail.com")
            }
          >
            giovanni.bonacci.cs@gmail.com
          </Text>
          <Text style={styles.aboutText}>
            or visit my social profiles on LinkedIn and GitHub:
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <FontAwesome5
              name="linkedin"
              size={26}
              color={Colors.theme.white}
              onPress={() =>
                Linking.openURL(
                  "https://www.linkedin.com/in/giovanni-alberico-bonacci-429933311/"
                )
              }
              style={styles.social}
            />
            <FontAwesome5
              name="github"
              size={26}
              color={Colors.theme.white}
              onPress={() => Linking.openURL("https://github.com/Giovalb-CS")}
              style={styles.social}
            />
          </View>
        </View>

        <View style={styles.animatedLogoContainer}>
          <AnimatedLogo width={300} height={300} />
        </View>

        <View style={{ alignItems: "center", height: 100 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "RigBuilderFont",
              color: "#8f8f8f",
            }}
          >
            © 2024 RigBuilder. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  animatedLogoContainer: {},
  social: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffffc9",
  },
  email: {
    textDecorationLine: "underline",
    color: Colors.theme.orange,
    fontFamily: "RigBuilderFontBold",
    fontSize: 16,
    textAlign: "center",
    width: 280,
    margin: "auto",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.theme.darkgrey,
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  icon: {
    paddingLeft: 15,
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
