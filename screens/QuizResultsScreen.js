import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Share } from 'react-native';
import { Trophy, RotateCcw, Home } from 'lucide-react-native';
import { calculateScore, getPersonalizedTip } from '../services/QuizService';

export default function QuizResultsScreen({ navigation, route }) {
  const { answers } = route.params;
  const scoreData = calculateScore(answers);
  const personalizedTip = getPersonalizedTip(answers);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I scored ${scoreData.score}/${scoreData.total} on the FoodIQ Quiz! 🎯\n\n${scoreData.level.title}\n\nCan you beat my score?`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handlePlayAgain = () => {
    navigation.navigate('QuizQuestion');
  };

  const handleGoHome = () => {
    navigation.navigate('Landing');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz Complete!</Text>
        </View>

        {/* Score Display */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{scoreData.score}</Text>
            <Text style={styles.scoreTotal}>/ {scoreData.total}</Text>
          </View>
          <Text style={styles.percentageText}>{scoreData.percentage}%</Text>
        </View>

        {/* Level Badge */}
        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>{scoreData.level.title}</Text>
          <Text style={styles.levelMessage}>{scoreData.level.message}</Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Your Performance</Text>
          
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{scoreData.correct}</Text>
              <Text style={styles.breakdownLabel}>Correct</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{scoreData.close}</Text>
              <Text style={styles.breakdownLabel}>Close</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{scoreData.wrong}</Text>
              <Text style={styles.breakdownLabel}>Wrong</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
            activeOpacity={0.8}
          >
            <RotateCcw color="white" size={20} />
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Home color="#22c55e" size={20} />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  scoreTotal: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400e',
  },
  levelSection: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  levelMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  breakdownSection: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  tipSection: {
    backgroundColor: '#dbeafe',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
  },
  tipIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 15,
    color: '#1e3a8a',
    lineHeight: 22,
  },
  actionsSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  shareButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
  },
  playAgainButton: {
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
  playAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  homeButtonText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
