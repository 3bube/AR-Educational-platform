import { Stack, useRouter } from "expo-router";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import styles from "./../styles/onboarding.styles.js";
import OnboardingPage from "./onboarding/Onboarding.jsx";

export default function App() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={() => router.push("/(auth)")}>
              <Text style={styles.buttonText}>Skip</Text>
            </Pressable>
          ),
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <OnboardingPage />
      </View>
    </SafeAreaView>
  );
}
