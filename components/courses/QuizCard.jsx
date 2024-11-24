import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function QuizCard({ quiz }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/quiz/${quiz.id}`)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="quiz" size={32} color="#491B6D" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {quiz.title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <MaterialIcons name="help-outline" size={16} color="#666" />
            <Text style={styles.statText}>{quiz.questions} questions</Text>
          </View>
          <View style={styles.stats}>
            <MaterialIcons name="timer" size={16} color="#666" />
            <Text style={styles.statText}>{quiz.duration} mins</Text>
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0E6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#333',
    marginBottom: 8,
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
