import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, FAB, Portal, Modal, Text, List } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDuration('');
    setQuestions([]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  const addQuestion = () => {
    if (!currentQuestion || options.some(opt => !opt)) {
      alert('Please fill in the question and all options');
      return;
    }

    const newQuestion = {
      question: currentQuestion,
      options,
      correctOption,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  const createQuiz = async () => {
    if (!title || !description || !duration || questions.length === 0) {
      alert('Please fill in all fields and add at least one question');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([
          {
            title,
            description,
            duration,
            questions,
            created_at: new Date(),
          },
        ])
        .select();

      if (error) throw error;

      setQuizzes([...quizzes, data[0]]);
      hideModal();
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {quizzes.map((quiz, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Title>{quiz.title}</Title>
              <Text>{quiz.description}</Text>
              <Text>Duration: {quiz.duration}</Text>
              <Text>Questions: {quiz.questions.length}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Edit</Button>
              <Button onPress={() => {}}>Delete</Button>
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
            <Title style={styles.modalTitle}>Create New Quiz</Title>
            
            <TextInput
              label="Quiz Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
            
            <TextInput
              label="Duration (in minutes)"
              value={duration}
              onChangeText={setDuration}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />

            <Title style={styles.sectionTitle}>Questions</Title>
            
            {questions.map((q, index) => (
              <List.Item
                key={index}
                title={q.question}
                description={`${q.options.length} options`}
                left={props => <List.Icon {...props} icon="help-circle" />}
              />
            ))}

            <Card style={styles.questionCard}>
              <Card.Content>
                <TextInput
                  label="Question"
                  value={currentQuestion}
                  onChangeText={setCurrentQuestion}
                  style={styles.input}
                  mode="outlined"
                />

                {options.map((option, index) => (
                  <View key={index} style={styles.optionContainer}>
                    <TextInput
                      label={`Option ${index + 1}`}
                      value={option}
                      onChangeText={(value) => updateOption(index, value)}
                      style={styles.optionInput}
                      mode="outlined"
                    />
                    <Button
                      mode={correctOption === index ? 'contained' : 'outlined'}
                      onPress={() => setCorrectOption(index)}
                      style={styles.correctButton}
                    >
                      Correct
                    </Button>
                  </View>
                ))}

                <Button
                  mode="outlined"
                  onPress={addQuestion}
                  style={styles.addButton}
                  icon="plus"
                >
                  Add Question
                </Button>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={createQuiz}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
            >
              Create Quiz
            </Button>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
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
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'PoppinsBold',
  },
  input: {
    marginBottom: 16,
  },
  questionCard: {
    marginVertical: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  correctButton: {
    minWidth: 100,
  },
  addButton: {
    marginTop: 16,
    borderColor: '#491B6D',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#491B6D',
  },
});
