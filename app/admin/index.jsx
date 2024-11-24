import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Manage Courses',
      description: 'Create, edit, and delete courses',
      icon: 'library-books',
      route: '/admin/courses',
    },
    {
      title: 'Manage Quizzes',
      description: 'Create and manage course quizzes',
      icon: 'quiz',
      route: '/admin/quizzes',
    },
    {
      title: 'Manage Lessons',
      description: 'View and manage lessons',
      icon: 'book',
      route: '/admin/lessons',
    },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <Card
          key={index}
          style={styles.card}
          onPress={() => router.push(item.route)}
        >
          <Card.Content style={styles.cardContent}>
            <MaterialIcons name={item.icon} size={40} color="#491B6D" />
            <View style={styles.textContainer}>
              <Title style={styles.title}>{item.title}</Title>
              <Paragraph style={styles.description}>{item.description}</Paragraph>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => router.push(item.route)}
              style={styles.button}
            >
              Manage
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PoppinsBold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#666',
  },
  button: {
    backgroundColor: '#491B6D',
  },
});
