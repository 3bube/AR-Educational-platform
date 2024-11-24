import React from 'react';
import { View, StyleSheet } from 'react-native';
import Greetings from '../components/dashboard/greetings';
import SearchBarComponent from '../components/dashboard/searchBar';
import CourseBanner from '../components/dashboard/courseBanner';
import CourseComponent from '../components/dashboard/features';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <CourseComponent 
        ListHeaderComponent={() => (
          <>
            <Greetings />
            <SearchBarComponent />
            <CourseBanner />
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
