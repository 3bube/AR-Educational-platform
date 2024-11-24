import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import CourseCard from '../../components/courses/CourseCard';
import QuizCard from '../../components/courses/QuizCard';
import { fetchCourses } from '../../api/courses.api';
import { useQuery } from '@tanstack/react-query';

// Sample quiz data - To be replaced with actual API integration
const sampleQuizzes = [
  {
    id: '1',
    title: 'Introduction to React Native',
    questions: 10,
    duration: 15,
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    questions: 15,
    duration: 20,
  },
  {
    id: '3',
    title: 'Mobile App Development',
    questions: 12,
    duration: 18,
  },
];

export default function Courses() {
  const [activeTab, setActiveTab] = useState('courses');

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const renderContent = () => {
    if (activeTab === 'courses') {
      if (isLoading) {
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#491B6D" />
            <Text style={styles.loadingText}>Loading courses...</Text>
          </View>
        );
      }

      if (error) {
        return (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Error loading courses</Text>
            <Text style={styles.errorSubtext}>{error.message}</Text>
          </View>
        );
      }

      if (!courses?.length) {
        return (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        );
      }

      return courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ));
    } else {
      return sampleQuizzes.map(quiz => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Center</Text>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
            onPress={() => setActiveTab('courses')}
          >
            <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
              Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'quizzes' && styles.activeTab]}
            onPress={() => setActiveTab('quizzes')}
          >
            <Text style={[styles.tabText, activeTab === 'quizzes' && styles.activeTabText]}>
              Quizzes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#491B6D',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#491B6D',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
