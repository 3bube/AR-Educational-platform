import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '../../../api/courses.api';
import CourseCard from './courseCard';

const CourseComponent = ({ ListHeaderComponent }) => {
  const { 
    data: courses, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['courses', 'science'],
    queryFn: async () => {
      const result = await getCourse('science');
      return result;
    }
  });

  const handleCoursePress = (course) => {
    if (course.url) {
      Linking.openURL(course.url);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#491B6D" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!courses?.courses) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No courses found</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={courses.courses}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <CourseCard 
          course={item} 
          onPress={handleCoursePress}
        />
      )}
      ListHeaderComponent={
        <>
          {ListHeaderComponent && ListHeaderComponent()}
          <Text style={styles.sectionTitle}>Featured Courses</Text>
        </>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.errorText}>No courses available</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CourseComponent;
