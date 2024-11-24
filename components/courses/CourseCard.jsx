import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function CourseCard({ course }) {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/course/${course.id}`)}
    >
      <Image 
        source={{ uri: course.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <MaterialIcons name="access-time" size={16} color="#666" />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
          <View style={styles.stats}>
            <MaterialIcons name="school" size={16} color="#666" />
            <Text style={styles.statText}>{course.lessons} lessons</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#666',
  },
});
