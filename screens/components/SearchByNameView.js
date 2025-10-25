import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { ChevronUp } from 'lucide-react-native';
import { searchProducts } from '../../services/OpenFoodFactsAPI';
import styles from '../../styles/LandingScreenStyles';

export default function SearchByNameView({
  onProductSelect,
  onToggleToScan,
}) {
  const [barcode, setBarcode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const isProcessing = useRef(false);

  const handleSearch = async (searchTerm) => {
    setSearching(true);

    try {
      const products = await searchProducts(searchTerm);

      setSearching(false);

      if (products.length === 0) {
        alert(`No products found for "${searchTerm}". Try a different search term.`);
        setBarcode('');
        return;
      }

      // Show product picker
      setSearchResults(products);
      setShowProductPicker(true);

    } catch (error) {
      setSearching(false);
      alert('Failed to search products. Please check your internet connection.');
      setBarcode('');
      console.error('Error:', error);
    }
  };

  const handleManualAnalyze = async () => {
    if (!barcode.trim()) {
      alert('Please enter a barcode or product name');
      return;
    }

    if (isProcessing.current) {
      return;
    }

    Keyboard.dismiss();
    isProcessing.current = true;

    // Check if input is a barcode (all digits) or a search term
    const isBarcode = /^\d+$/.test(barcode.trim());

    if (isBarcode) {
      // Handle as barcode - delegate to parent
      await onProductSelect(barcode.trim(), 'manual');
    } else {
      // Handle as search term
      await handleSearch(barcode.trim());
    }

    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);
  };

  const handleProductSelectFromPicker = async (apiProduct) => {
    setShowProductPicker(false);
    setBarcode('');
    setSearchResults([]);

    // Delegate to parent
    await onProductSelect(apiProduct, 'search');
  };

  const handleExamplePress = async (exampleInput) => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    // Check if input is a barcode (all digits) or a search term
    const isBarcode = /^\d+$/.test(exampleInput.trim());

    if (isBarcode) {
      // Handle as barcode - direct to results
      await onProductSelect(exampleInput.trim(), 'manual');
    } else {
      // Handle as search term - show product picker
      await handleSearch(exampleInput.trim());
    }

    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);
  };

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Product Name:</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Name (e.g. 'Cheerios')"
            placeholderTextColor="#9ca3af"
            value={barcode}
            onChangeText={setBarcode}
            editable={!searching}
            returnKeyType="search"
            onSubmitEditing={handleManualAnalyze}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            autoFocus={Platform.OS === 'web'}
          />
        </View>

        <TouchableOpacity
          style={[styles.analyzeButton, searching && styles.analyzeButtonDisabled]}
          onPress={handleManualAnalyze}
          disabled={searching}
          activeOpacity={0.8}
        >
          {searching ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.analyzeButtonText}>Search</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            Keyboard.dismiss();
            onToggleToScan();
          }}
        >
          <Text style={styles.toggleText}>Or use camera to scan</Text>
          <ChevronUp color="#22c55e" size={20} />
        </TouchableOpacity>

        {/* Example Barcodes - Auto-wrapping grid */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Try these examples:</Text>

          <View style={styles.examplesFlexGrid}>
            {[
              { name: 'Nature Valley', code: '8410076600790' },
              { name: 'Coca-Cola', code: '5449000601971' },
              { name: "Cheetos", code: '028400047173' },
              { name: 'Cheerios', code: '016000275287' },
              { name: 'Greek Yogurt', code: '5201054017432' },
              { name: 'Oreos', code: '7622201756697' },
            ].map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleButtonFlex}
                onPress={() => handleExamplePress(example.code)}
              >
                <Text style={styles.exampleText}>{example.name}</Text>
                <Text style={styles.exampleBarcode}>{example.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spacer for keyboard */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Product Picker Modal */}
      <Modal
        visible={showProductPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProductPicker(false)}
        >
          <View style={styles.pickerModal} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.pickerTitle}>Select Product</Text>

            <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
              {searchResults.map((product, index) => {
                const name = product.product_name || 'Unknown Product';
                const brand = product.brands || 'Unknown Brand';
                const hasImage = product.image_url || product.image_front_url;

                return (
                  <TouchableOpacity
                    key={product.code || `product-${index}`}
                    style={styles.productItem}
                    onPress={() => handleProductSelectFromPicker(product)}
                    activeOpacity={0.7}
                  >
                    {hasImage ? (
                      <Image
                        source={{ uri: product.image_url || product.image_front_url }}
                        style={styles.productThumb}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={[styles.productThumb, styles.noThumb]}>
                        <Text style={styles.noThumbText}>?</Text>
                      </View>
                    )}

                    <View style={styles.productDetails}>
                      <Text style={styles.productItemName} numberOfLines={2}>
                        {name}
                      </Text>
                      <Text style={styles.productItemBrand} numberOfLines={1}>
                        {brand}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowProductPicker(false);
                setSearchResults([]);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
