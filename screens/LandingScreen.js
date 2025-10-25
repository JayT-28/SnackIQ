import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { History } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductByBarcode, parseProductData } from '../services/OpenFoodFactsAPI';
import BarcodeScannerView from './components/BarcodeScannerView';
import SearchByNameView from './components/SearchByNameView';
import styles from '../styles/LandingScreenStyles';
import logo from './SnackIQ.png';

export default function LandingScreen({ navigation, route }) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing product...');
  const [showManualInput, setShowManualInput] = useState(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (route.params?.openSearch) {
      setShowManualInput(true);
      // Clear the param so it doesn't trigger again
      navigation.setParams({ openSearch: undefined });
    }
  }, [route.params?.openSearch]);

  useFocusEffect(
    React.useCallback(() => {
      // When screen is focused (user returns)
      return () => {
        // Cleanup when leaving screen
        setScanning(false);
        isProcessing.current = false;
      };
    }, [])
  );  

  const fetchAndNavigate = async (barcodeValue, source = 'manual') => {
    setLoadingText('Analyzing product...');
    setLoading(true);

    try {
      const apiProduct = await getProductByBarcode(barcodeValue);

      if (!apiProduct) {
        // Product not found
        setLoading(false);
        Alert.alert(
          'Product Not Found',
          `Barcode ${barcodeValue} not found in database. Try another product.`,
          [{
            text: 'OK',
            onPress: () => {
              // Stay in the same mode the user was using
              if (source === 'manual') {
                setShowManualInput(true);  // Stay in manual mode
              } else {
                setShowManualInput(false);  // Return to scan mode
              }
            }
          }]
        );
        return;
      }

      const productData = parseProductData(apiProduct);

      // Reset states before navigation
      setLoading(false);

      // Navigate to results
      await saveToHistory(productData);
      if (source === 'manual') {
        navigation.navigate('Results', { 
          product: productData, 
          from: 'Search'
        });
      } else {
        navigation.navigate('Results', { 
          product: productData, 
          from: 'Landing'
        });
      }

    } catch (error) {
      // Network error
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to fetch product data. Please check your internet connection.',
        [{
          text: 'OK',
          onPress: () => {
            // Stay in the same mode
            if (source === 'manual') {
              setShowManualInput(true);
            } else {
              setShowManualInput(false);
            }
          }
        }]
      );
      console.error('Error:', error);
    }
  };

  const handleProductSelect = async (productOrBarcode, source) => {
    // If it's a barcode string, fetch it
    if (typeof productOrBarcode === 'string') {
      await fetchAndNavigate(productOrBarcode, source);
    } else {
      // It's an API product object from search - parse and navigate
      setLoading(true);
      try {
        const productData = parseProductData(productOrBarcode);
        setLoading(false);
        setLoadingText('Analyzing product...');
        await saveToHistory(productData);
        navigation.navigate('Results', { 
          product: productData, 
          from: 'Search'
        });
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Failed to load product details');
        console.error('Error:', error);
      }
    }
  };

  const HISTORY_KEY = '@snackiq_history';
  const MAX_HISTORY = 10;

  // Add this function in your component
  const saveToHistory = async (productData) => {
    try {
      // Get existing history
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      let history = stored ? JSON.parse(stored) : [];
      
      // Create history item
      const historyItem = {
        name: productData.name,
        brand: productData.brand,
        image: productData.image,
        rating: productData.rating,
        timestamp: Date.now(),
        ...productData, // Include full data for navigation
      };
      
      // Remove duplicate if exists (same name)
      history = history.filter(item => item.name !== productData.name);
      
      // Add to beginning
      history.unshift(historyItem);
      
      // Keep only last 3
      history = history.slice(0, MAX_HISTORY);
      
      // Save back
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Loading Overlay
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </View>
    );
  }

  // Camera Scanner View (full screen)
  if (scanning) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <BarcodeScannerView
          scanning={scanning}
          onScanComplete={fetchAndNavigate}
          onStartScan={() => setScanning(true)}
          onCloseScan={() => setScanning(false)}
          onToggleToSearch={() => setShowManualInput(true)}
        />
      </>
    );
  }

  // Main Landing View
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback
        onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {/* Header */}
          <View style={styles.header}>
            <Image 
              source={logo }
              style={styles.logo}
              resizeMode="contain"
            />
            {/* <Text style={styles.emoji}>🥗</Text>
            <Text style={styles.title}>SnackIQ</Text> */}
            <Text style={styles.subtitle}>
              See what's actually in your snacks
            </Text>
            {/* History Button */}
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.7}
            >
              <History color="#22c55e" size={24} />
            </TouchableOpacity>
            
          </View>

          {/* Main Content - Toggle between Scan and Search */}
          {!showManualInput ? (
            <BarcodeScannerView
              scanning={false}
              onScanComplete={fetchAndNavigate}
              onStartScan={() => setScanning(true)}
              onCloseScan={() => setScanning(false)}
              onToggleToSearch={() => setShowManualInput(true)}
            />
          ) : (
            <SearchByNameView
              onProductSelect={handleProductSelect}
              onToggleToScan={() => setShowManualInput(false)}
            />
          )}

          {/* Bottom Info */}
          <View style={styles.footer}>
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <View style={styles.dot} />
                <Text style={styles.featureText}>Fast</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.dot} />
                <Text style={styles.featureText}>Simple</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.dot} />
                <Text style={styles.featureText}>Facts</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* Floating Quiz Button */}
      <TouchableOpacity
        style={styles.floatingQuizButton}
        onPress={() => navigation.navigate('QuizLanding')}
        activeOpacity={0.9}
      >
        <Text style={styles.floatingQuizEmoji}>🎮</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
