import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { X } from 'lucide-react-native';
import { getQuizQuestions } from '../services/QuizService';

export default function QuizQuestionScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Load quiz questions
    const quizQuestions = getQuizQuestions(10, 'mixed');
    setQuestions(quizQuestions);
  }, []);

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = currentIndex + 1;
  const total = questions.length;

  const handleAnswer = (selectedRating) => {
    const isCorrect = selectedRating === currentQuestion.correctRating;

    // Save answer
    const answer = {
      questionId: currentQuestion.id,
      userAnswer: selectedRating,
      correctAnswer: currentQuestion.correctRating,
      isCorrect: isCorrect,
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    // Navigate to feedback screen
    navigation.navigate('QuizFeedback', {
      answer: answer,
      question: currentQuestion,
      isLastQuestion: currentIndex === questions.length - 1,
      allAnswers: updatedAnswers,
      onNext: () => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.progressText}>
            Question {progress}/{total}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate('Landing')}
        >
          <X color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${(progress / total) * 100}%` }]} />
      </View>

      {/* Question Content */}
      <View style={styles.questionContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentQuestion.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.brandText}>{currentQuestion.brand}</Text>
          <Text style={styles.productName}>{currentQuestion.productName}</Text>
        </View>

        {/* Question */}
        <Text style={styles.questionText}>
          Is this a healthy choice?
        </Text>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.optionGreen]}
            onPress={() => handleAnswer('green')}
            activeOpacity={0.8}
          >
            <Text style={styles.optionEmoji}>🟢</Text>
            <Text style={styles.optionText}>Good</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.optionYellow]}
            onPress={() => handleAnswer('yellow')}
            activeOpacity={0.8}
          >
            <Text style={styles.optionEmoji}>🟡</Text>
            <Text style={styles.optionText}>Okay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.optionRed]}
            onPress={() => handleAnswer('red')}
            activeOpacity={0.8}
          >
            <Text style={styles.optionEmoji}>🔴</Text>
            <Text style={styles.optionText}>Nope</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#fde68a',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 3,
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 180,
    height: 180,
  },
  productInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionGreen: {
    backgroundColor: '#d1fae5',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  optionYellow: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  optionRed: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
