// Quiz Service - Handles quiz logic

import quizProducts from '../data/quizProducts.json';

/**
 * Get a random set of quiz questions
 * @param {number} count - Number of questions (default 10)
 * @param {string} difficulty - 'easy', 'medium', 'hard', or 'mixed'
 * @returns {Array} Array of quiz questions
 */
export function getQuizQuestions(count = 10, difficulty = 'mixed') {
  let filteredProducts = [...quizProducts];
  
  if (difficulty !== 'mixed') {
    filteredProducts = quizProducts.filter(p => p.difficulty === difficulty);
  }
  
  // Shuffle array
  const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
  
  // Get subset
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Calculate quiz score
 * @param {Array} answers - Array of {questionId, userAnswer, correctAnswer}
 * @returns {Object} Score details
 */
export function calculateScore(answers) {
  let correct = 0;
  let close = 0;
  let wrong = 0;
  
  answers.forEach(answer => {
    if (answer.userAnswer === answer.correctAnswer) {
      correct++;
    } else if (isCloseAnswer(answer.userAnswer, answer.correctAnswer)) {
      close++;
    } else {
      wrong++;
    }
  });
  
  const total = answers.length;
  const score = correct;
  const percentage = Math.round((correct / total) * 100);
  
  return {
    correct,
    close,
    wrong,
    total,
    score,
    percentage,
    level: getScoreLevel(percentage)
  };
}

/**
 * Check if answer is close to correct
 */
function isCloseAnswer(userAnswer, correctAnswer) {
  const ratings = ['green', 'yellow', 'red'];
  const userIndex = ratings.indexOf(userAnswer);
  const correctIndex = ratings.indexOf(correctAnswer);
  
  // Adjacent answers are "close"
  return Math.abs(userIndex - correctIndex) === 1;
}

/**
 * Get achievement level based on percentage
 */
function getScoreLevel(percentage) {
  if (percentage >= 90) return {
    title: '🏆 Nutrition Expert',
    message: "You're a food genius! You can spot healthy foods like a pro."
  };
  if (percentage >= 80) return {
    title: '🏆 Smart Shopper',
    message: "Great job! You know how to read through marketing BS."
  };
  if (percentage >= 70) return {
    title: '🏆 Learning Fast',
    message: "Good work! You're getting better at spotting healthy foods."
  };
  if (percentage >= 60) return {
    title: '🏆 Getting Started',
    message: "Not bad! Keep practicing to improve your food IQ."
  };
  return {
    title: '🏆 Room to Grow',
    message: "Don't give up! Every quiz helps you learn more about nutrition."
  };
}

/**
 * Get personalized tip based on wrong answers
 */
export function getPersonalizedTip(answers) {
  const wrongAnswers = answers.filter(a => a.userAnswer !== a.correctAnswer);
  
  if (wrongAnswers.length === 0) {
    return "Perfect score! You've mastered spotting healthy foods!";
  }
  
  // Analyze patterns in wrong answers
  const trickyCategoryCounted = wrongAnswers.filter(
    a => quizProducts.find(p => p.id === a.questionId)?.category === 'tricky'
  ).length;
  
  if (trickyCategoryCounted >= 3) {
    return "Watch out for foods marketed as 'healthy' - check the actual nutrition facts!";
  }
  
  const highSugarMissed = wrongAnswers.filter(a => {
    const product = quizProducts.find(p => p.id === a.questionId);
    return product?.explanation.toLowerCase().includes('sugar');
  }).length;
  
  if (highSugarMissed >= 2) {
    return "Tip: Look for hidden sugars! Many 'healthy' products have more sugar than you'd expect.";
  }
  
  return "Keep practicing! The more you learn, the easier it gets to spot truly healthy foods.";
}
