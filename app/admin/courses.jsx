import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  Button,
  ToastAndroid,
} from 'react-native';
import { Card, Title, FAB, Portal, Modal, ActivityIndicator, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { saveCourse, fetchCourses, deleteCourse } from './../../api/courses.api';
import { uploadFile } from '../../api/upload.api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/auth';

export default function ManageCourses() {
  const { signOut } = useAuth();
  const [visible, setVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({
    title: { text: '' },
    description: { text: '' },
    duration: { text: '' },
    category: { text: '' },
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    resetForm();
  };

  const showEditModal = (course) => {
    setSelectedCourse(course);
    setForm({
      title: { text: course.title },
      description: { text: course.description },
      duration: { text: course.duration },
      category: { text: course.category },
    });
    setThumbnail(course.thumbnail);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    resetForm();
    setSelectedCourse(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error logging out:', error);
      ToastAndroid.show('Error logging out', ToastAndroid.SHORT);
    }
  };

  const { data: courses, isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const result = await fetchCourses();
      return result;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="default" color="#491B6D" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching courses</Text>
      </View>
    );
  }

  const resetForm = () => {
    setForm({
      title: { text: '' },
      description: { text: '' },
      duration: { text: '' },
      category: { text: '' },
    });
    setThumbnail(null);
  };

  const handleInputChange = (name, event) => {
    const { text } = event.nativeEvent;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: { text },
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setThumbnail(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const createCourse = async () => {
    try {
      setLoading(true);
      const { title, description, duration, category } = form;

      // Upload thumbnail if it's a local file
      const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : null;

      const courseData = {
        title: title.text,
        description: description.text,
        duration: duration.text,
        category: category.text,
        thumbnail: thumbnailUrl,
      };

      if (selectedCourse) {
        await saveCourse({ ...courseData, id: selectedCourse.id });
      } else {
        await saveCourse(courseData);
      }

      resetForm();
      setVisible(false);
      refetch();
    } catch (error) {
      console.error('Error creating course:', error);
      Alert.alert('Error', 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async () => {
    try {
      setLoading(true);
      const { title, description, duration, category } = form;

      // Upload thumbnail if it's a local file
      const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : null;

      const courseData = {
        title: title.text,
        description: description.text,
        duration: duration.text,
        category: category.text,
        thumbnail: thumbnailUrl,
      };

      await saveCourse({ ...courseData, id: selectedCourse.id });

      resetForm();
      setEditModalVisible(false);
      refetch();
    } catch (error) {
      console.error('Error updating course:', error);
      Alert.alert('Error', 'Failed to update course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      ToastAndroid.show('Course Deleted!', ToastAndroid.SHORT);
      refetch();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course. Please try again.');
    }
  };

  const renderForm = (onSubmit, submitText) => (
    <View style={styles.form}>
      <Text>Course Title</Text>
      <TextInput
        value={form.title.text}
        onChange={(event) => handleInputChange('title', event)}
        style={styles.input}
        placeholder="Enter course title"
      />

      <Text>Description</Text>
      <TextInput
        value={form.description.text}
        onChange={(event) => handleInputChange('description', event)}
        style={styles.input}
        placeholder="Enter course description"
        multiline
      />

      <Text>Category</Text>
      <TextInput
        value={form.category.text}
        onChange={(event) => handleInputChange('category', event)}
        style={styles.input}
        placeholder="Enter category"
      />

      <Text>Duration (e.g., '8 weeks')</Text>
      <TextInput
        value={form.duration.text}
        onChange={(event) => handleInputChange('duration', event)}
        style={styles.input}
        placeholder="Enter duration"
      />

      <Button
        title={thumbnail ? 'Change Image' : 'Add Thumbnail'}
        onPress={pickImage}
        color="#491B6D"
      />

      <Button
        title={loading ? 'Saving...' : submitText}
        onPress={onSubmit}
        disabled={loading}
        color="#491B6D"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Manage Courses</Title>
        <IconButton
          icon="logout"
          size={24}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>

      <ScrollView>
        {courses?.map((course, index) => (
          <Card key={index} style={styles.courseCard}>
            <Card.Content>
              <Title>{course?.title}</Title>
              <Text>{course?.description}</Text>
              <Text>Duration: {course?.duration}</Text>
            </Card.Content>
            <Card.Actions>
              <Button title="Edit" onPress={() => showEditModal(course)} />
              <Button title="Delete" onPress={() => handleDelete(course.id)} />
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Create New Course</Title>
            {renderForm(createCourse, 'Create Course')}
          </ScrollView>
        </Modal>

        <Modal
          visible={editModalVisible}
          onDismiss={hideEditModal}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Edit Course</Title>
            {renderForm(updateCourse, 'Update Course')}
          </ScrollView>
        </Modal>
      </Portal>

      <FAB icon="plus" style={styles.fab} onPress={showModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#491B6D',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsBold',
  },
  logoutButton: {
    margin: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: 16,
    padding: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#491B6D',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'PoppinsBold',
  },
  courseCard: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
});
