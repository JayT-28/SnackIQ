import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import QuizLandingScreen from './screens/QuizLandingScreen';
import QuizQuestionScreen from './screens/QuizQuestionScreen';
import QuizFeedbackScreen from './screens/QuizFeedbackScreen';
import QuizResultsScreen from './screens/QuizResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="QuizLanding" component={QuizLandingScreen} />
        <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
        <Stack.Screen name="QuizFeedback" component={QuizFeedbackScreen} />
        <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
