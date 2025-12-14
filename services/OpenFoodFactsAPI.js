// Open Food Facts API Service

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';
const SEARCH_BASE = "https://world.openfoodfacts.org/cgi/search.pl";

/**
 * Parse serving size and extract numeric value in grams
 * @param {string} servingSize - Serving size string (e.g., "1 cup (55g)", "30g", "2 cookies")
 * @returns {number|null} Serving size in grams or null if can't parse
 */
function parseServingGrams(servingSize) {
  if (!servingSize) return null;

  // Try to extract number followed by 'g' (case insensitive)
  const match = servingSize.match(/(\d+(?:\.\d+)?)\s*g/i);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Validate if serving size is reasonable for rating calculations
 * @param {number} servingGrams - Serving size in grams
 * @param {string} productName - Product name for context
 * @returns {Object} { isValid: boolean, warning: string|null }
 */
function validateServingSize(servingGrams, productName = '') {
  if (!servingGrams) {
    return { isValid: false, warning: 'No serving size specified' };
  }

  const lower = productName.toLowerCase();

  // Condiments and sauces: 5-30g is reasonable
  const isCondiment = ['sauce', 'ketchup', 'mustard', 'mayo', 'dressing', 'salsa'].some(w => lower.includes(w));
  if (isCondiment) {
    if (servingGrams < 5) {
      return { isValid: false, warning: `Serving size unusually small (${servingGrams}g)` };
    }
    return { isValid: true, warning: null };
  }

  // Snacks and main foods: 20-200g is reasonable
  if (servingGrams < 20) {
    return { isValid: false, warning: `Serving size suspiciously small (${servingGrams}g) - manufacturer may be minimizing nutrition facts` };
  }

  if (servingGrams > 500) {
    return { isValid: false, warning: `Serving size very large (${servingGrams}g)` };
  }

  return { isValid: true, warning: null };
}

/**
 * Fetch product by barcode
 * @param {string} barcode - Product barcode (EAN-13, UPC, etc.)
 * @returns {Promise<Object>} Product data or null if not found
 */
export async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(`${BASE_URL}/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 0) {
      // Product not found
      return null;
    }
    
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Calculate rating based on nutrition
 * @param {Object} nutriments - Nutrition data from API
 * @param {boolean} usePerServing - Whether to use per-serving values (true) or per-100g (false)
 * @returns {string} 'green', 'yellow', or 'red'
 */
export function calculateRating(nutriments, usePerServing = true) {
  if (!nutriments) return 'yellow';

  let redFlags = 0;
  let yellowFlags = 0;
  let greenFlags = 0;

  // Choose data source based on usePerServing flag
  let sugars, sodium, satFat, calories, protein, fiber;

  if (usePerServing && nutriments['sugars_serving']) {
    // Use per-serving values
    sugars = nutriments['sugars_serving'] || 0;
    sodium = nutriments['sodium_serving'] ? nutriments['sodium_serving'] * 1000 : 0;
    satFat = nutriments['saturated-fat_serving'] || 0;
    calories = nutriments['energy-kcal_serving'] || 0;
    protein = nutriments['proteins_serving'] || 0;
    fiber = nutriments['fiber_serving'] || 0;
  } else {
    // Fallback to per-100g values
    sugars = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
    sodium = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
    satFat = nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0;
    calories = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
    protein = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
    fiber = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
  }

  // Red flags (bad things)
  // Thresholds are calibrated for per-serving values
  // For per-100g, these thresholds still make sense as they scale proportionally

  // High added sugar (>12g per serving or >10g per 100g)
  const sugarThreshold = usePerServing ? 12 : 10;
  const sugarMediumThreshold = usePerServing ? 6 : 5;
  if (sugars > sugarThreshold) redFlags++;
  if (sugars > sugarMediumThreshold && sugars <= sugarThreshold) yellowFlags++;

  // High sodium (>500mg per serving or >400mg per 100g)
  const sodiumThreshold = usePerServing ? 500 : 400;
  const sodiumMediumThreshold = usePerServing ? 250 : 200;
  if (sodium > sodiumThreshold) redFlags++;
  if (sodium > sodiumMediumThreshold && sodium <= sodiumThreshold) yellowFlags++;

  // High saturated fat (>6g per serving or >5g per 100g)
  const satFatThreshold = usePerServing ? 6 : 5;
  const satFatMediumThreshold = usePerServing ? 3 : 2;
  if (satFat > satFatThreshold) redFlags++;
  if (satFat > satFatMediumThreshold && satFat <= satFatThreshold) yellowFlags++;

  // Very high calories (>250 per serving or >400 per 100g)
  const calorieThreshold = usePerServing ? 250 : 400;
  const lowProteinCalorieThreshold = usePerServing ? 150 : 100;
  const lowProteinThreshold = usePerServing ? 3 : 2;
  if (calories > calorieThreshold) redFlags++;
  if (calories > lowProteinCalorieThreshold && protein < lowProteinThreshold) redFlags++;

  // Green flags (good things)
  // Good fiber (>4g per serving or >3g per 100g)
  const fiberThreshold = usePerServing ? 4 : 3;
  if (fiber > fiberThreshold) greenFlags++;

  // Good protein (>7g per serving or >5g per 100g)
  const proteinThreshold = usePerServing ? 7 : 5;
  if (protein > proteinThreshold) greenFlags++;

  // Rating logic
  if (redFlags >= 2) return 'red';
  if (yellowFlags >= 2) return 'yellow';
  if (redFlags === 1 && greenFlags === 0) return 'yellow';
  if (greenFlags >= 2 && redFlags === 0) return 'green';
  if (greenFlags >= 1 && yellowFlags <= 1) return 'green';

  return 'yellow'; // Default to moderate
}

/**
 * Get nutrient status (green/yellow/red) for individual nutrients
 * @param {string} nutrientType - Type of nutrient (sugar, sodium, satfat, protein, fiber)
 * @param {number} value - Nutrient value
 * @param {boolean} isPerServing - Whether value is per-serving (true) or per-100g (false)
 * @returns {string} 'green', 'yellow', or 'red'
 */
function getNutrientStatus(nutrientType, value, isPerServing = true) {
  switch(nutrientType) {
    case 'sugar':
      if (isPerServing) {
        if (value > 15) return 'red';      // >15g per serving
        if (value > 6) return 'yellow';    // 6-15g per serving
        return 'green';                     // <6g per serving
      } else {
        if (value > 15) return 'red';      // >15g per 100g
        if (value > 5) return 'yellow';    // 5-15g per 100g
        return 'green';                     // <5g per 100g
      }

    case 'sodium':
      if (isPerServing) {
        if (value > 500) return 'red';     // >500mg per serving
        if (value > 250) return 'yellow';  // 250-500mg per serving
        return 'green';                     // <250mg per serving
      } else {
        if (value > 500) return 'red';     // >500mg per 100g
        if (value > 200) return 'yellow';  // 200-500mg per 100g
        return 'green';                     // <200mg per 100g
      }

    case 'satfat':
      if (isPerServing) {
        if (value > 6) return 'red';       // >6g per serving
        if (value > 3) return 'yellow';    // 3-6g per serving
        return 'green';                     // <3g per serving
      } else {
        if (value > 5) return 'red';       // >5g per 100g
        if (value > 2) return 'yellow';    // 2-5g per 100g
        return 'green';                     // <2g per 100g
      }

    case 'protein':
      if (isPerServing) {
        if (value > 10) return 'green';    // >10g per serving
        if (value > 5) return 'yellow';    // 5-10g per serving
        return 'red';                       // <5g per serving
      } else {
        if (value > 10) return 'green';    // >10g per 100g
        if (value > 5) return 'yellow';    // 5-10g per 100g
        return 'red';                       // <5g per 100g
      }

    case 'fiber':
      if (isPerServing) {
        if (value > 5) return 'green';     // >5g per serving
        if (value > 2) return 'yellow';    // 2-5g per serving
        return 'red';                       // <2g per serving
      } else {
        if (value > 5) return 'green';     // >5g per 100g
        if (value > 2) return 'yellow';    // 2-5g per 100g
        return 'red';                       // <2g per 100g
      }

    default:
      return 'yellow';
  }
}

/**
 * Parse ingredient list and highlight concerning ones
 */
function parseIngredients(ingredientsText) {
  if (!ingredientsText) return [];
  
  // Split by comma and clean up
  const ingredientsList = ingredientsText
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);
  
  // Keywords to flag
  const sugarKeywords = ['sugar', 'syrup', 'corn syrup', 'high fructose', 'dextrose', 'maltose', 'sucrose', 'glucose'];
  const preservativeKeywords = ['bht', 'bha', 'sodium benzoate', 'potassium sorbate', 'sulfite'];
  const artificialKeywords = ['red 40', 'yellow 5', 'yellow 6', 'blue 1', 'artificial color', 'artificial flavor'];
  
  return ingredientsList.map(ingredient => {
    const lower = ingredient.toLowerCase();
    let highlighted = false;
    let reason = '';
    
    // Check for sugars
    if (sugarKeywords.some(keyword => lower.includes(keyword))) {
      highlighted = true;
      reason = 'Added sugar - contributes to total sugar content';
    }
    // Check for preservatives
    else if (preservativeKeywords.some(keyword => lower.includes(keyword))) {
      highlighted = true;
      reason = 'Synthetic preservative - used to extend shelf life';
    }
    // Check for artificial additives
    else if (artificialKeywords.some(keyword => lower.includes(keyword))) {
      highlighted = true;
      reason = 'Artificial additive - some studies suggest potential health concerns';
    }
    
    return {
      name: ingredient,
      highlighted,
      reason
    };
  });
}

/**
 * Generate "bottom line" summary
 * @param {Object} product - Product data from API
 * @param {string} rating - Rating (green/yellow/red)
 * @param {Object} nutriments - Nutrition data from API
 * @param {boolean} usePerServing - Whether values are per-serving (true) or per-100g (false)
 * @param {string} servingSize - Serving size string for display
 * @returns {string} Summary text
 */
function generateBottomLine(product, rating, nutriments, usePerServing = true, servingSize = '100g') {
  const name = product.product_name || 'This product';
  const unit = usePerServing ? 'per serving' : 'per 100g';

  let sugars, fiber, protein, sodium;

  if (usePerServing && nutriments['sugars_serving']) {
    sugars = nutriments['sugars_serving'] || 0;
    fiber = nutriments['fiber_serving'] || 0;
    protein = nutriments['proteins_serving'] || 0;
    sodium = nutriments['sodium_serving'] ? nutriments['sodium_serving'] * 1000 : 0;
  } else {
    sugars = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
    fiber = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
    protein = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
    sodium = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
  }

  let summary = '';

  if (rating === 'red') {
    summary = `${name} is high in concerning nutrients. `;
    if (sugars > 15) summary += `Contains ${Math.round(sugars)}g of sugar ${unit}. `;
    if (sodium > 500) summary += `High sodium content (${Math.round(sodium)}mg ${unit}). `;
    if (fiber < 2) summary += `Low in fiber. `;
    summary += 'Consider healthier alternatives.';
  } else if (rating === 'yellow') {
    summary = `${name} is a moderate choice. `;
    if (sugars > 10) summary += `Contains ${Math.round(sugars)}g of sugar ${unit}, which is moderately high. `;
    if (fiber < 3 && protein < 5) summary += `Could be more nutritious - low in fiber and protein. `;
    summary += 'Okay occasionally, but look for better options for regular consumption.';
  } else {
    summary = `${name} is a good nutritional choice. `;
    if (protein > 10) summary += `Good source of protein (${Math.round(protein)}g ${unit}). `;
    if (fiber > 5) summary += `High in fiber (${Math.round(fiber)}g ${unit}). `;
    if (sugars < 5) summary += `Low in sugar. `;
    summary += 'A smart pick for regular consumption.';
  }

  return summary;
}

/**
 * Parse Open Food Facts product data into our app format
 * @param {Object} apiProduct - Raw product data from API
 * @returns {Object} Formatted product data for our app
 */
export function parseProductData(apiProduct) {
  if (!apiProduct) return null;

  const nutriments = apiProduct.nutriments || {};
  const productName = apiProduct.product_name || 'Unknown Product';

  // Get serving size info
  const servingSize = apiProduct.serving_size || apiProduct.serving_quantity || '100g';
  const servingGrams = parseServingGrams(servingSize);
  const servingValidation = validateServingSize(servingGrams, productName);

  // Determine if we should use per-serving for rating
  const usePerServing = servingValidation.isValid && nutriments['sugars_serving'];

  // Calculate rating using appropriate values
  const rating = calculateRating(nutriments, usePerServing);

  // --- PER-SERVING DATA ---
  const servingSugars = nutriments['sugars_serving'] || 0;
  const servingProtein = nutriments['proteins_serving'] || 0;
  const servingFiber = nutriments['fiber_serving'] || 0;
  const servingSodium = nutriments['sodium_serving'] ? nutriments['sodium_serving'] * 1000 : 0;
  const servingSatFat = nutriments['saturated-fat_serving'] || 0;
  const servingCalories = Math.round(nutriments['energy-kcal_serving'] || 0);

  // --- PER-100G DATA ---
  const sugars100g = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
  const protein100g = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
  const fiber100g = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
  const sodium100g = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
  const satFat100g = nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0;
  const calories100g = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0);

  // Helper function to calculate daily values
  const calcDaily = (value, dailyTarget) => Math.round((value / dailyTarget) * 100);

  // --- BUILD PER-SERVING NUTRITION OBJECT ---
  // Check if we have ANY per-serving data (not just sugars)
  const hasServingData = nutriments['energy-kcal_serving'] ||
                         nutriments['sugars_serving'] ||
                         nutriments['proteins_serving'] ||
                         nutriments['fiber_serving'] ||
                         nutriments['sodium_serving'] ||
                         nutriments['saturated-fat_serving'];

  const perServingNutrition = hasServingData ? {
    calories: servingCalories,
    addedSugar: {
      value: Math.round(servingSugars),
      status: getNutrientStatus('sugar', servingSugars, true),
      daily: calcDaily(servingSugars, 50)
    },
    protein: {
      value: Math.round(servingProtein),
      status: getNutrientStatus('protein', servingProtein, true),
      daily: calcDaily(servingProtein, 50)
    },
    fiber: {
      value: Math.round(servingFiber),
      status: getNutrientStatus('fiber', servingFiber, true),
      daily: calcDaily(servingFiber, 28)
    },
    sodium: {
      value: Math.round(servingSodium),
      status: getNutrientStatus('sodium', servingSodium, true),
      daily: calcDaily(servingSodium, 2300)
    },
    satFat: {
      value: Math.round(servingSatFat),
      status: getNutrientStatus('satfat', servingSatFat, true),
      daily: calcDaily(servingSatFat, 20)
    }
  } : null;

  // --- BUILD PER-100G NUTRITION OBJECT ---
  const per100gNutrition = {
    calories: calories100g,
    addedSugar: {
      value: Math.round(sugars100g),
      status: getNutrientStatus('sugar', sugars100g, false),
      daily: calcDaily(sugars100g, 50)
    },
    protein: {
      value: Math.round(protein100g),
      status: getNutrientStatus('protein', protein100g, false),
      daily: calcDaily(protein100g, 50)
    },
    fiber: {
      value: Math.round(fiber100g),
      status: getNutrientStatus('fiber', fiber100g, false),
      daily: calcDaily(fiber100g, 28)
    },
    sodium: {
      value: Math.round(sodium100g),
      status: getNutrientStatus('sodium', sodium100g, false),
      daily: calcDaily(sodium100g, 2300)
    },
    satFat: {
      value: Math.round(satFat100g),
      status: getNutrientStatus('satfat', satFat100g, false),
      daily: calcDaily(satFat100g, 20)
    }
  };

  return {
    name: productName,
    barcode: apiProduct.code,
    brand: apiProduct.brands || 'Unknown Brand',
    image: apiProduct.image_url || apiProduct.image_front_url || 'https://via.placeholder.com/150',
    rating: rating,
    bottomLine: generateBottomLine(apiProduct, rating, nutriments, usePerServing, servingSize),
    servingSize: servingSize,
    servingSizeWarning: servingValidation.warning,
    nutrition: {
      // Primary nutrition is per-serving if valid, otherwise per-100g
      ...(usePerServing ? perServingNutrition : per100gNutrition),
      servingSize: servingSize,
      // Include both for comparison
      perServing: perServingNutrition,
      per100g: per100gNutrition
    },
    ingredients: parseIngredients(apiProduct.ingredients_text)
  };
}

/**
 * Search products by name (useful for fallback)
 * 
 * https://search.openfoodfacts.org/search?q=cheerios&page_size=10&page=1&\
 * fields=code,product_name,brands,image_url,image_front_url
 */
export async function searchProducts(query, page = 1) {
  try {
    const response = await fetch(
      `${SEARCH_BASE}/search?search_terms=${encodeURIComponent(query)}&page=1&page_size=10&json=true`
    );
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}
