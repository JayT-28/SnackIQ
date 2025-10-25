import { Image, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import floater from '../styles/LandingScreenStyles';
import logoImage from "./SnackQuiz.png"

export default function QuizLandingScreen({ navigation }) {
  const handleStartQuiz = () => {
    navigation.navigate('QuizQuestion');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={logoImage }
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Test your Snack IQ!
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>See a product</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>Guess if it's healthy</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>Learn why you're right (or wrong!)</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsText}>
            <Text style={styles.detailsBold}>10 questions</Text>
            {'\n'}
            Mix of obvious and tricky products
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuiz}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
      {/* Floating Scan Button */}
      <TouchableOpacity
        style={floater.floatingScanButton}
        onPress={() => navigation.navigate('Landing')}
        activeOpacity={0.9}
      >
        <Text style={floater.floatingScanEmoji}>📷</Text>
      </TouchableOpacity>

      {/* Bottom Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Learn to spot obvious good and bad snacks!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb', // light green
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  logo: {
    width: 200,
    height: 150,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  detailsCard: {
    backgroundColor: '#fde68a', // lighter orange
    borderWidth: 2,
    borderColor: '#fbbf24', // orange border
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  detailsText: {
    fontSize: 16,
    color: '#92400e', // dark orange text
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsBold: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  startButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  startButtonEmoji: {
    fontSize: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
