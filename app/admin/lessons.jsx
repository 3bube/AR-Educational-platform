import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { Card, Title, FAB, Portal, Modal, ActivityIndicator, IconButton } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/auth';
import { createLesson, getLessons, updateLesson, deleteLesson } from '../../api/lessons.api';
import { fetchCourses } from '../../api/courses.api';

export default function ManageLessons() {
  const { signOut } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: { text: '' },
    content: { text: '' },
    duration: { text: '' },
    videoUrl: { text: '' },
  });

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    resetForm();
  };

  const showEditModal = (lesson) => {
    setSelectedLesson(lesson);
    setForm({
      title: { text: lesson.title },
      content: { text: lesson.content },
      duration: { text: lesson.duration },
      videoUrl: { text: lesson.video_url || '' },
    });
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setSelectedLesson(null);
    resetForm();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error logging out:', error);
      ToastAndroid.show('Error logging out', ToastAndroid.SHORT);
    }
  };

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch lessons for selected course
  const { data: lessons, isLoading: lessonsLoading, refetch } = useQuery({
    queryKey: ['lessons', selectedCourse?.id],
    queryFn: () => getLessons(selectedCourse?.id),
    enabled: !!selectedCourse?.id,
    staleTime: 5 * 60 * 1000,
  });

  const resetForm = () => {
    setForm({
      title: { text: '' },
      content: { text: '' },
      duration: { text: '' },
      videoUrl: { text: '' },
    });
  };

  const handleCreateLesson = async () => {
    const { title, content, duration, videoUrl } = form;

    if (!selectedCourse) {
      ToastAndroid.show('Please select a course first', ToastAndroid.SHORT);
      return;
    }

    if (!title.text || !content.text || !duration.text) {
      ToastAndroid.show('Please fill in all required fields', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      await createLesson({
        course_id: selectedCourse.id,
        title: title.text,
        content: content.text,
        duration: duration.text,
        video_url: videoUrl.text,
      });

      ToastAndroid.show('Lesson created successfully!', ToastAndroid.SHORT);
      refetch();
      hideModal();
    } catch (error) {
      console.error('Error creating lesson:', error);
      ToastAndroid.show('Error creating lesson', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async () => {
    const { title, content, duration, videoUrl } = form;

    if (!title.text || !content.text || !duration.text) {
      ToastAndroid.show('Please fill in all required fields', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      await updateLesson(selectedLesson.id, {
        title: title.text,
        content: content.text,
        duration: duration.text,
        video_url: videoUrl.text,
      });

      ToastAndroid.show('Lesson updated successfully!', ToastAndroid.SHORT);
      refetch();
      hideEditModal();
    } catch (error) {
      console.error('Error updating lesson:', error);
      ToastAndroid.show('Error updating lesson', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLesson(id);
      ToastAndroid.show('Lesson deleted successfully!', ToastAndroid.SHORT);
      refetch();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      ToastAndroid.show('Error deleting lesson', ToastAndroid.SHORT);
    }
  };

  const renderForm = (onSubmit, submitText) => (
    <View style={styles.form}>
      <Text>Title *</Text>
      <TextInput
        style={styles.input}
        value={form.title.text}
        onChangeText={(text) => setForm({ ...form, title: { text } })}
        placeholder="Enter lesson title"
      />

      <Text>Content *</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={form.content.text}
        onChangeText={(text) => setForm({ ...form, content: { text } })}
        placeholder="Enter lesson content"
        multiline
      />

      <Text>Duration (minutes) *</Text>
      <TextInput
        style={styles.input}
        value={form.duration.text}
        onChangeText={(text) => setForm({ ...form, duration: { text } })}
        placeholder="Enter lesson duration"
        keyboardType="numeric"
      />

      <Text>Video URL (optional)</Text>
      <TextInput
        style={styles.input}
        value={form.videoUrl.text}
        onChangeText={(text) => setForm({ ...form, videoUrl: { text } })}
        placeholder="Enter video URL"
      />

      <Button
        title={loading ? 'Loading...' : submitText}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );

  if (coursesLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#491B6D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Select a Course</Title>
        <IconButton
          icon="logout"
          size={24}
          onPress={handleLogout}
          style={styles.logoutButton}
          color="#491B6D"
        />
      </View>

      <ScrollView style={styles.courseList}>
        {courses?.map((course) => (
          <Card 
            key={course.id} 
            style={[
              styles.courseCard,
              selectedCourse?.id === course.id && styles.selectedCourse
            ]}
            onPress={() => setSelectedCourse(course)}
          >
            <Card.Content>
              <Title>{course.title}</Title>
              <Text>{course.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {selectedCourse && (
        <>
          <Title style={styles.sectionTitle}>Lessons for {selectedCourse.title}</Title>
          {lessonsLoading ? (
            <ActivityIndicator size="small" color="#491B6D" />
          ) : (
            <ScrollView style={styles.lessonList}>
              {lessons?.length > 0 ? (
                lessons.map((lesson) => (
                  <Card key={lesson.id} style={styles.lessonCard}>
                    <Card.Content>
                      <Title>{lesson.title}</Title>
                      <Text>Duration: {lesson.duration} minutes</Text>
                      <Text numberOfLines={2}>{lesson.content}</Text>
                      {lesson.video_url && (
                        <Text style={styles.videoUrl}>Video Available</Text>
                      )}
                    </Card.Content>
                    <Card.Actions>
                      <Button title="Edit" onPress={() => showEditModal(lesson)} />
                      <Button 
                        title="Delete" 
                        onPress={() => handleDelete(lesson.id)}
                        color="#ff4444"
                      />
                    </Card.Actions>
                  </Card>
                ))
              ) : (
                <Text style={styles.noLessons}>No lessons found for this course</Text>
              )}
            </ScrollView>
          )}
        </>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showModal}
        disabled={!selectedCourse}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Create New Lesson</Title>
          {renderForm(handleCreateLesson, 'Create Lesson')}
        </Modal>

        <Modal
          visible={editModalVisible}
          onDismiss={hideEditModal}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Edit Lesson</Title>
          {renderForm(handleUpdateLesson, 'Update Lesson')}
        </Modal>
      </Portal>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerTitle: {
    fontFamily: 'PoppinsBold',
    color: '#491B6D',
  },
  courseList: {
    maxHeight: '40%',
  },
  lessonList: {
    flex: 1,
  },
  sectionTitle: {
    padding: 16,
    fontFamily: 'PoppinsBold',
    color: '#491B6D',
  },
  form: {
    gap: 8,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#491B6D',
    fontFamily: 'PoppinsBold',
  },
  courseCard: {
    margin: 8,
    marginHorizontal: 16,
  },
  selectedCourse: {
    borderColor: '#491B6D',
    borderWidth: 2,
  },
  lessonCard: {
    margin: 8,
    marginHorizontal: 16,
  },
  videoUrl: {
    color: '#491B6D',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#491B6D',
  },
  noLessons: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});
