import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

export default function OnboardingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const handleAuth = () => {
    router.push("/(auth)");
  };

  const images = [
    {
      id: "1",
      image: require("./../../assets/images/undraw_educator_re_s3jk.png"),
      title: "Welcome to DWD",
      subtitle:
        "Welcome as you learn a world changing skill to get a better job.",
    },
    {
      id: "2",
      image: require("./../../assets/images/undraw_online_learning_re_qw08.png"),
      title: "Choose Your Course",
      subtitle:
        "Choose the course of your choice and gain industry knowledge and experience in it.",
    },
    {
      id: "3",
      image: require("./../../assets/images/undraw_certification_re_ifll.png"),
      title: "Get Certified",
      subtitle:
        "Start learning and get certified after your training to get a lucrative job.",
    },
  ];

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setCurrentIndex(previousIndex);
      flatListRef.current.scrollToIndex({ index: previousIndex });
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const index = Math.floor(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width + 0.5
    );
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.image} />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={index === currentIndex ? styles.activeDot : styles.dot}
          />
        ))}
      </View>

      <Text style={styles.title}>{images[currentIndex].title}</Text>
      <Text style={styles.subtitle}>{images[currentIndex].subtitle}</Text>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
        {currentIndex === images.length - 1 ? (
          <Pressable style={styles.button} onPress={() => handleAuth()}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: Dimensions.get("window").width,
    height: 250,
    resizeMode: "contain",
    marginBottom: 50,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#6A1B9A",
    marginHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#491B6D",
    textAlign: "center",
    fontFamily: "PoppinsBold", // Add Poppins font here
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    width: 400,
    color: "#333",
    paddingHorizontal: 20,
    fontFamily: "Poppins", // Add Poppins font here
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 40,
    position: "relative",
  },
  backButton: {
    color: "#491B6D",
    position: "absolute",
    
    left: 0,
  },
  button: {
    backgroundColor: "#491B6D",
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 5,
    position: "absolute",
    right: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins", // Add Poppins font here
  },
  backButtonText: {
    color: "#491B6D",
    fontSize: 18,
    fontFamily: "PoppinsBold", // Add Poppins font here
  },
});
