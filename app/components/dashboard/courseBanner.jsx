import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '../../../api/courses.api';

const { width } = Dimensions.get('window');

export default function CourseBanner() {

  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.content}>

        <View style={styles.textContainer}>
          <Text variant="titleLarge" style={styles.title}>
            New Course!
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            User Experience Class
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/courses')}
            style={[styles.button]}
            buttonColor="#C983DE"
            labelStyle={styles.buttonText}
            contentStyle={styles.buttonContent}
          >
            View now
          </Button>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/Ellipse 6.png')}
            style={styles.ellipse}
            resizeMode="contain"
          />
          <Image
            source={require('../../../assets/images/Working Remotely 1.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#491B6D',
    borderRadius: 7,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    color: 'white',
    fontFamily: 'PoppinsBold',
    marginBottom: 8,
  },
  description: {
    color: 'white',
    fontFamily: 'Poppins',
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    width: 110,
  },
  buttonContent: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonText: {
    fontFamily: 'PoppinsBold',
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
    width: width / 2,
    height: "100%",
  },
  mainImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  ellipse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: -40,
    right: -20,
    zIndex: 1,
  },
});