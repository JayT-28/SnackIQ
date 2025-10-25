import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, ScrollView, StatusBar } from 'react-native';
import { X, CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';

const openOpenFoodFacts = (barcode) => {
  Linking.openURL('https://world.openfoodfacts.org/product/'+barcode);
};

export default function QuizFeedbackScreen({ navigation, route }) {
  const { answer, question, isLastQuestion, allAnswers, onNext } = route.params;

  const isCorrect = answer.isCorrect;
  const isClose = !isCorrect && Math.abs(
    ['green', 'yellow', 'red'].indexOf(answer.userAnswer) -
    ['green', 'yellow', 'red'].indexOf(answer.correctAnswer)
  ) === 1;

  const getRatingColor = (rating) => {
    if (rating === 'green') return '#22c55e';
    if (rating === 'yellow') return '#f59e0b';
    return '#ef4444';
  };

  const getRatingText = (rating) => {
    if (rating === 'green') return '🟢 Good';
    if (rating === 'yellow') return '🟡 Okay';
    return '🔴 Nope';
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Navigate to results
      navigation.navigate('QuizResults', { answers: allAnswers });
    } else {
      // Go back to question screen and trigger next question
      navigation.goBack();
      if (onNext) onNext();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.top}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.progressText}>
            Answer
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
      <View style={styles.progressBarContainer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Result Header */}
        <View style={[
          styles.resultHeader,
          isCorrect ? styles.resultHeaderCorrect : styles.resultHeaderWrong
        ]}>
          {isCorrect ? (
            <>
              <CheckCircle color="white" size={48} />
              <Text style={styles.resultTitle}>Correct!</Text>
            </>
          ) : (
            <>
              <XCircle color="white" size={48} />
              <Text style={styles.resultTitle}>
                {isClose ? 'Close!' : 'Not quite!'}
              </Text>
            </>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productSection}>
          <Image
            source={{ uri: question.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text style={styles.productName}>{question.productName}</Text>
        </View>

        {/* Answer Comparison */}
        <View style={styles.comparisonSection}>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>You chose:</Text>
            <View style={[
              styles.answerBadge,
              { backgroundColor: getRatingColor(answer.userAnswer) }
            ]}>
              <Text style={styles.answerBadgeText}>
                {getRatingText(answer.userAnswer)}
              </Text>
            </View>
          </View>

          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Correct answer:</Text>
            <View style={[
              styles.answerBadge,
              { backgroundColor: getRatingColor(answer.correctAnswer) }
            ]}>
              <Text style={styles.answerBadgeText}>
                {getRatingText(answer.correctAnswer)}
              </Text>
            </View>
          </View>
        </View>

        {/* Explanation */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationTitle}>Why?</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>

        <View style={styles.attributionSection}>
          <TouchableOpacity onPress={() => openOpenFoodFacts(question.barcode)} activeOpacity={0.7}>
            <Image
              source={require('../assets/openfoodfacts-logo.png')}
              style={styles.attributionLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Next Button (Fixed at bottom) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </Text>
          <ArrowRight color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  top: {
    paddingBottom: 30,
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
  scrollView: {
    flex: 1,
  },
  resultHeader: {
    paddingTop: 30,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  resultHeaderCorrect: {
    backgroundColor: '#22c55e',
  },
  resultHeaderWrong: {
    backgroundColor: '#ef4444',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  productSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 2,
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  comparisonSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 2,
    gap: 16,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  answerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  answerBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  explanationSection: {
    backgroundColor: '#fef3c7',
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 2,
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: '#78350f',
    lineHeight: 24,
  },
  attributionSection: {
    alignItems: 'left',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attributionLogo: {
    width: 150,
    height: 50,
  },
  tipSection: {
    backgroundColor: '#dbeafe',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#1e40af',
    lineHeight: 22,
  },
  fullAnalysisButton: {
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    alignItems: 'center',
  },
  fullAnalysisText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
