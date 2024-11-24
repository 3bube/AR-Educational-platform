import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getLesson } from '../../api/lessons.api';
import { useQuery } from '@tanstack/react-query';

export default function LessonViewer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLesson(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const handleComplete = async () => {
    setIsComplete(true);
    // TODO: Update lesson progress in database
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#491B6D" />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load lesson</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>{lesson.title}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <MaterialIcons name="access-time" size={20} color="#666" />
              <Text style={styles.statText}>{lesson.duration} minutes</Text>
            </View>
            {isComplete && (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{lesson.description}</Text>
          
          <Text style={styles.lessonContent}>{lesson.content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.buttonText}>Back to Course</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.completeButton, isComplete && styles.completedButton]}
          onPress={handleComplete}
          disabled={isComplete}
        >
          <MaterialIcons 
            name={isComplete ? "check-circle" : "check"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {isComplete ? 'Completed' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: '#333',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    color: '#666',
    fontFamily: 'Poppins',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  completedText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  lessonContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'Poppins',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#491B6D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  completedButton: {
    backgroundColor: '#81C784',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
});
