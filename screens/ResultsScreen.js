import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Linking, Modal } from 'react-native';
import { ChevronLeft, AlertCircle, Info, Home } from 'lucide-react-native';

const openOpenFoodFacts = (barcode) => {
  Linking.openURL('https://world.openfoodfacts.org/product/'+barcode);
};

export default function ResultsScreen({ navigation, route }) {
  const [showIngredientInfo, setShowIngredientInfo] = useState(null);
  const [nutritionView, setNutritionView] = useState('100g'); // 'serving' or '100g'

  // Get product from navigation params (real API data) or use fallback
  const product = route.params?.product || {
    // Fallback to sample data if no product passed
    name: "Sample Product",
    brand: "Sample Brand",
    image: "https://via.placeholder.com/150",
    rating: "yellow",
    ratingPer100g: "yellow",
    bottomLine: "No product data available. Please scan a product.",
    bottomLinePer100g: "No product data available. Please scan a product.",
    nutrition: {
      calories: 0,
      addedSugar: { value: 0, status: "green", daily: 0 },
      protein: { value: 0, status: "green", daily: 0 },
      fiber: { value: 0, status: "green", daily: 0 },
      sodium: { value: 0, status: "green", daily: 0 },
      satFat: { value: 0, status: "green", daily: 0 }
    },
    ingredients: []
  };

  // Dynamically select rating and bottom line based on toggle
  const currentRating = nutritionView === 'serving'
    ? product.rating
    : (product.ratingPer100g || product.rating);

  const currentBottomLine = nutritionView === 'serving'
    ? product.bottomLine
    : (product.bottomLinePer100g || product.bottomLine);

  const getRatingColor = (rating) => {
    if (rating === "green") return "#22c55e";
    if (rating === "yellow") return "#eab308";
    return "#ef4444";
  };

  const getRatingBgColor = (rating) => {
    if (rating === "green") return "#22c55e";
    if (rating === "yellow") return "#eab308";
    return "#ef4444";
  };

  const getRatingText = (rating) => {
    if (rating === "green") return "Good";
    if (rating === "yellow") return "Okay";
    return "Nope";
  };

  const getStatusEmoji = (status) => {
    if (status === "green") return "🟢";
    if (status === "yellow") return "🟡";
    return "🔴";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            const from = route.params?.from;
            if (from === 'History') {
              navigation.navigate('History');
            } else if (from === 'Search') {
              navigation.navigate('Landing', { openSearch: true });
            } else {
              navigation.navigate('Landing');
            }
          }}
          style={styles.backButton}
        >
          <ChevronLeft color="#374151" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Landing')}
          style={styles.homeButton}
          activeOpacity={0.7}
        >
          <Home color="#22c55e" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Info */}
        <View style={styles.productSection}>
          <View style={styles.productInfo}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productText}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Line */}
        <View style={styles.bottomLineSection}>
          {/* Header Row with Icons */}
          <View style={styles.bottomLineHeader}>
            <View style={styles.bottomLineHeaderLeft}>
              <AlertCircle color="#a16207" size={20} />
              <Text style={styles.bottomLineTitle}>The Bottom Line</Text>
              {/* Rating Badge */}
              <View style={[styles.ratingBadge, { backgroundColor: getRatingBgColor(currentRating) }]}>
                <Text style={styles.ratingText}>{getRatingText(currentRating)}</Text>
              </View>
            </View>

            {/* Attribution */}
            <TouchableOpacity
              style={styles.attributionButton}
              onPress={() => openOpenFoodFacts(product.barcode)}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/openfoodfacts-logo.png')}
                style={styles.attributionLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Full Width Text */}
          <Text style={styles.bottomLineText}>{currentBottomLine}</Text>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.nutritionSection}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>

          {/* Toggle Switch */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                nutritionView === 'serving' && styles.toggleButtonActive
              ]}
              onPress={() => setNutritionView('serving')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.toggleButtonText,
                nutritionView === 'serving' && styles.toggleButtonTextActive
              ]}>
                Per Serving
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                nutritionView === '100g' && styles.toggleButtonActive
              ]}
              onPress={() => setNutritionView('100g')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.toggleButtonText,
                nutritionView === '100g' && styles.toggleButtonTextActive
              ]}>
                Per 100g
              </Text>
            </TouchableOpacity>
          </View>

          {/* Serving Size Label */}
          {nutritionView === 'serving' && product.nutrition.servingSize && (
            <Text style={styles.servingSizeLabel}>Serving size: {product.nutrition.servingSize}</Text>
          )}

          {/* Serving Size Warning */}
          {nutritionView === 'serving' && product.servingSizeWarning && (
            <View style={styles.servingWarning}>
              <AlertCircle color="#dc2626" size={16} />
              <Text style={styles.servingWarningText}>{product.servingSizeWarning}</Text>
            </View>
          )}

          {/* Dynamically select nutrition data based on toggle */}
          {(() => {
            const currentNutrition = nutritionView === 'serving'
              ? product.nutrition.perServing
              : product.nutrition.per100g;

            // Fallback to main nutrition if perServing is null
            const nutritionData = currentNutrition || product.nutrition;

            return (
              <>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{nutritionData.calories}</Text>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Added Sugar</Text>
                  <View style={styles.nutritionRight}>
                    <Text style={styles.nutritionValue}>{nutritionData.addedSugar.value}g</Text>
                    <Text style={styles.nutritionDaily}>({nutritionData.addedSugar.daily}% daily)</Text>
                    <Text style={styles.nutritionEmoji}>{getStatusEmoji(nutritionData.addedSugar.status)}</Text>
                  </View>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <View style={styles.nutritionRight}>
                    <Text style={styles.nutritionValue}>{nutritionData.protein.value}g</Text>
                    <Text style={styles.nutritionDaily}>({nutritionData.protein.daily}% daily)</Text>
                    <Text style={styles.nutritionEmoji}>{getStatusEmoji(nutritionData.protein.status)}</Text>
                  </View>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Fiber</Text>
                  <View style={styles.nutritionRight}>
                    <Text style={styles.nutritionValue}>{nutritionData.fiber.value}g</Text>
                    <Text style={styles.nutritionDaily}>({nutritionData.fiber.daily}% daily)</Text>
                    <Text style={styles.nutritionEmoji}>{getStatusEmoji(nutritionData.fiber.status)}</Text>
                  </View>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Sodium</Text>
                  <View style={styles.nutritionRight}>
                    <Text style={styles.nutritionValue}>{nutritionData.sodium.value}mg</Text>
                    <Text style={styles.nutritionDaily}>({nutritionData.sodium.daily}% daily)</Text>
                    <Text style={styles.nutritionEmoji}>{getStatusEmoji(nutritionData.sodium.status)}</Text>
                  </View>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Saturated Fat</Text>
                  <View style={styles.nutritionRight}>
                    <Text style={styles.nutritionValue}>{nutritionData.satFat.value}g</Text>
                    <Text style={styles.nutritionDaily}>({nutritionData.satFat.daily}% daily)</Text>
                    <Text style={styles.nutritionEmoji}>{getStatusEmoji(nutritionData.satFat.status)}</Text>
                  </View>
                </View>
              </>
            );
          })()}
        </View>

        {/* Ingredients */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsGrid}>
            {product.ingredients.map((ingredient, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => ingredient.highlighted ? setShowIngredientInfo(ingredient) : null}
                style={[
                  styles.ingredientPill,
                  ingredient.highlighted && styles.ingredientPillHighlighted
                ]}
                activeOpacity={ingredient.highlighted ? 0.6 : 1}
              >
                <Text style={[
                  styles.ingredientText,
                  ingredient.highlighted && styles.ingredientTextHighlighted
                ]}>
                  {ingredient.name}
                  {ingredient.highlighted && " ⚠️"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {product.ingredients.some(i => i.highlighted) && (
            <Text style={styles.ingredientsHint}>
              Tap highlighted ingredients to learn more
            </Text>
          )}
        </View>

        <View style={styles.actionButtonsSection}>
          <TouchableOpacity
            style={styles.halfButton}
            onPress={() => navigation.navigate('Landing')}
            activeOpacity={0.8}
          >
            <Text style={styles.scanAnotherText}>📷 Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.halfButtonOutline}
            onPress={() => navigation.navigate('Landing', { openSearch: true })}
            activeOpacity={0.8}
          >
            <Text style={styles.searchAgainText}>🔍 Search</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Ingredient Info Modal */}
      <Modal
        visible={showIngredientInfo !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIngredientInfo(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIngredientInfo(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            {showIngredientInfo && (
              <>
                <View style={styles.modalHeader}>
                  <Info color="#ef4444" size={24} />
                  <Text style={styles.modalTitle}>{showIngredientInfo.name}</Text>
                </View>
                <Text style={styles.modalText}>{showIngredientInfo.reason}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowIngredientInfo(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  homeButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  productSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  productInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productText: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6b7280',
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  ratingText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomLineSection: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  bottomLineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bottomLineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bottomLineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#78350f',
  },
  bottomLineText: {
    fontSize: 16,
    color: '#78350f',
    lineHeight: 24,
  },
  attributionButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 1,
    paddingVertical: 0,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  attributionLogo: {
    width: 122,
    height: 40,
  },
  nutritionSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  toggleButtonTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  servingSizeLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  servingWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 16,
  },
  servingWarningText: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 18,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  nutritionLabel: {
    fontSize: 15,
    color: '#374151',
  },
  nutritionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  nutritionDaily: {
    fontSize: 12,
    color: '#6b7280',
  },
  nutritionEmoji: {
    fontSize: 16,
  },
  ingredientsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  ingredientPillHighlighted: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  ingredientText: {
    fontSize: 14,
    color: '#374151',
  },
  ingredientTextHighlighted: {
    color: '#991b1b',
    fontWeight: '500',
  },
  ingredientsHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  },
  actionButtonsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  halfButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  halfButtonOutline: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  scanAnotherText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchAgainText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  quizChallengeSection: {
      paddingHorizontal: 24,
      paddingVertical: 24,
      backgroundColor: '#fef3c7',
      alignItems: 'center',
    },
    quizChallengeTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#92400e',
      textAlign: 'center',
      marginBottom: 16,
    },
    quizChallengeButton: {
      backgroundColor: '#f59e0b',
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    quizChallengeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
});