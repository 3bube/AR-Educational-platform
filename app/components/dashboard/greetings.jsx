import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../../../context/auth';

const Greetings = () => {
  const { user } = useAuth();
  const name = user?.user_metadata?.name || 'Student';

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  return (
    <View style={styles.container}>

      <View style={styles.greetingContainer}>
      <Text 
        variant="headlineSmall" 
        style={styles.greetingFont}
      >
        Good {getTimeOfDay()}, {name}
      </Text>
      </View>

      <Text 
        variant="bodyLarge" 
        style={styles.subtitle}
      >
        What do you want to learn?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  greetingFont: {
    color: 'black',
    fontFamily: 'PoppinsBold',
    marginBottom: 8,
    fontSize: 24,
  },
  subtitle: {
    color: 'grey',
    fontFamily: 'Poppins',
    fontSize: 15,
    marginTop: 8,
  },
});

export default Greetings;
