import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Sample quiz data - Replace with API call
const quizData = {
  id: '1',
  title: 'React Native Fundamentals Quiz',
  duration: 30, // in minutes
  questions: [
    {
      id: '1',
      question: 'What is React Native?',
      options: [
        'A mobile browser',
        'A framework for building mobile apps',
        'A programming language',
        'A database system',
      ],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: 'Which company developed React Native?',
      options: [
        'Google',
        'Apple',
        'Facebook',
        'Microsoft',
      ],
      correctAnswer: 2,
    },
    {
      id: '3',
      question: 'What language is used to write React Native apps?',
      options: [
        'Java',
        'Swift',
        'Python',
        'JavaScript',
      ],
      correctAnswer: 3,
    },
  ],
};

export default function Quiz() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quizData.duration * 60);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer');
      return;
    }

    // Check if answer is correct
    if (selectedAnswer === quizData.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setIsQuizComplete(true);
    // TODO: Save quiz results to database
  };

  const calculatePercentage = () => {
    return Math.round((score / quizData.questions.length) * 100);
  };

  if (isQuizComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scorePercentage}>{calculatePercentage()}%</Text>
          </View>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultText}>
            You scored {score} out of {quizData.questions.length} questions correctly
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Return to Quizzes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>
          <MaterialIcons name="timer" size={24} color="#491B6D" />
          {' '}{formatTime(timeLeft)}
        </Text>
        <Text style={styles.progress}>
          Question {currentQuestion + 1}/{quizData.questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          {quizData.questions[currentQuestion].question}
        </Text>

        {quizData.questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedAnswer === index && styles.selectedOption,
            ]}
            onPress={() => handleAnswer(index)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === index && styles.selectedOptionText,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentQuestion + 1 === quizData.questions.length ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 18,
    color: '#491B6D',
    fontFamily: 'Poppins',
  },
  progress: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins',
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    fontSize: 22,
    color: '#333',
    marginBottom: 30,
    fontFamily: 'PoppinsBold',
  },
  option: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#491B6D',
    borderColor: '#491B6D',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins',
  },
  selectedOptionText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#491B6D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#491B6D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercentage: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'PoppinsBold',
  },
  resultTitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    fontFamily: 'PoppinsBold',
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});
