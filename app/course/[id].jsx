import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth';
import { getLessons } from '../../api/lessons.api';
import { fetchCourse, enrollUser } from '../../api/courses.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id, user?.id),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const { course, enrollment } = courseDetails || {};

  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => getLessons(id),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  // Show loading state when either course or lessons are loading
  if (courseLoading || lessonsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#491B6D" />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  // Show error state if either query fails
  if (courseError || lessonsError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {courseError ? 'Error loading course' : 'Error loading lessons'}
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If no course found
  if (!courseDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Course not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEnroll = async () => {
    try {
      await enrollUser(user?.id, id);
      Alert.alert(
        'Enrollment Successful',
        'You have successfully enrolled in the course.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
      // Refetch course details to update enrollment status
      queryClient.invalidateQueries(['course', id]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const startLesson = (lessonId) => {
    if (!enrollment) {
      alert('Please enroll in the course to access lessons');
      return;
    }
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {course?.thumbnail && (
          <Image 
            source={{ uri: course?.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          <Text style={styles.title}>{course?.title}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <MaterialIcons name="access-time" size={20} color="#666" />
              <Text style={styles.statText}>
                {course?.duration || 'Duration not set'}
              </Text>
            </View>
            <View style={styles.stat}>
              <MaterialIcons name="school" size={20} color="#666" />
              <Text style={styles.statText}>{lessons.length} lessons</Text>
            </View>
            <View style={styles.stat}>
              <MaterialIcons name="person" size={20} color="#666" />
              <Text style={styles.statText}>
                {course?.instructor || 'John Doe'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.description}>
            {course?.description || 'No description available'}
          </Text>

          <Text style={styles.sectionTitle}>Course Content</Text>
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => startLesson(lesson.id)}
              >
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>
                    {lesson.duration ? `${lesson.duration} minutes` : 'Duration not set'}
                  </Text>
                </View>
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noLessons}>No lessons available yet</Text>
          )}
        </View>
      </ScrollView>

      {!enrollment && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.enrollButton}
            onPress={handleEnroll}
          >
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#333',
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  statText: {
    marginLeft: 5,
    color: '#666',
    fontFamily: 'Poppins',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#491B6D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins',
  },
  lessonDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Poppins',
  },
  noLessons: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  enrollButton: {
    backgroundColor: '#491B6D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  backButton: {
    backgroundColor: '#491B6D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});