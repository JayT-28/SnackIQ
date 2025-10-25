// Open Food Facts API Service

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';
const SEARCH_BASE = "https://world.openfoodfacts.org/cgi/search.pl";

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
 * @returns {string} 'green', 'yellow', or 'red'
 */
export function calculateRating(nutriments, nutrition) {
  if (!nutriments) return 'yellow';
  
  let redFlags = 0;
  let yellowFlags = 0;
  let greenFlags = 0;
  
  // Red flags (bad things)
  // High added sugar (>10g per 100g or >12g per serving)
  const sugars = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
  if (sugars > 10) redFlags++;
  if (sugars > 5 && sugars <= 10) yellowFlags++;
  
  // High sodium (>400mg per 100g or >500mg per serving)
  const sodium = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
  if (sodium > 400) redFlags++;
  if (sodium > 200 && sodium <= 400) yellowFlags++;
  
  // High saturated fat (>5g per 100g or >6g per serving)
  const satFat = nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0;
  if (satFat > 5) redFlags++;
  if (satFat > 2 && satFat <=5) yellowFlags++;
  
  // Very high calories per 100g (>400)
  const calories = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
  const protein = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
  if (calories > 400) redFlags++;
  if (calories > 100 && protein < 2) redFlags++;
  
  // Green flags (good things)
  // Good fiber (>3g per 100g)
  const fiber = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
  if (fiber > 3) greenFlags++;
  
  // Good protein (>5g per 100g)
  if (protein > 5) greenFlags++;
  
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
 */
function getNutrientStatus(nutrientType, value, per100g = true) {
  // Adjust thresholds based on per 100g or per serving
  const multiplier = per100g ? 1 : 1;
  
  switch(nutrientType) {
    case 'sugar':
      if (value > 15 * multiplier) return 'red';
      if (value > 5 * multiplier) return 'yellow';
      return 'green';
    
    case 'sodium':
      if (value > 500 * multiplier) return 'red';
      if (value > 200 * multiplier) return 'yellow';
      return 'green';
    
    case 'satfat':
      if (value > 5 * multiplier) return 'red';
      if (value > 2 * multiplier) return 'yellow';
      return 'green';
    
    case 'protein':
      if (value > 10 * multiplier) return 'green';
      if (value > 5 * multiplier) return 'yellow';
      return 'red';
    
    case 'fiber':
      if (value > 5 * multiplier) return 'green';
      if (value > 2 * multiplier) return 'yellow';
      return 'red';
    
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
 */
function generateBottomLine(product, rating, nutriments) {
  const name = product.product_name || 'This product';
  const sugars = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
  const fiber = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
  const protein = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
  const sodium = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
  
  let summary = '';
  
  if (rating === 'red') {
    summary = `${name} is high in concerning nutrients. `;
    if (sugars > 15) summary += `Contains ${Math.round(sugars)}g of sugar per 100g. `;
    if (sodium > 500) summary += `High sodium content (${Math.round(sodium)}mg per 100g). `;
    if (fiber < 2) summary += `Low in fiber. `;
    summary += 'Consider healthier alternatives.';
  } else if (rating === 'yellow') {
    summary = `${name} is a moderate choice. `;
    if (sugars > 10) summary += `Contains ${Math.round(sugars)}g of sugar per 100g, which is moderately high. `;
    if (fiber < 3 && protein < 5) summary += `Could be more nutritious - low in fiber and protein. `;
    summary += 'Okay occasionally, but look for better options for regular consumption.';
  } else {
    summary = `${name} is a good nutritional choice. `;
    if (protein > 10) summary += `Good source of protein (${Math.round(protein)}g per 100g). `;
    if (fiber > 5) summary += `High in fiber (${Math.round(fiber)}g per 100g). `;
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
  const rating = calculateRating(nutriments);
  
  // Get serving size info
  const servingSize = apiProduct.serving_size || '100g';
  const per100g = true; // We'll standardize to per 100g for consistency
  
  // Extract nutrition values (prefer per 100g for consistency)
  const sugars = nutriments['sugars_100g'] || nutriments['sugars'] || 0;
  const protein = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
  const fiber = nutriments['fiber_100g'] || nutriments['fiber'] || 0;
  const sodium = nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : nutriments['sodium'] || 0;
  const satFat = nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0;
  const calories = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0);
  
  // Calculate % daily values (based on 2000 calorie diet)
  const sugarDaily = Math.round((sugars / 50) * 100); // 50g daily limit
  const proteinDaily = Math.round((protein / 50) * 100); // 50g daily target
  const fiberDaily = Math.round((fiber / 28) * 100); // 28g daily target
  const sodiumDaily = Math.round((sodium / 2300) * 100); // 2300mg daily limit
  const satFatDaily = Math.round((satFat / 20) * 100); // 20g daily limit
  
  return {
    name: apiProduct.product_name || 'Unknown Product',
    barcode: apiProduct.code, 
    brand: apiProduct.brands || 'Unknown Brand',
    image: apiProduct.image_url || apiProduct.image_front_url || 'https://via.placeholder.com/150',
    rating: rating,
    bottomLine: generateBottomLine(apiProduct, rating, nutriments),
    nutrition: {
      calories: calories,
      servingSize: servingSize,
      addedSugar: {
        value: Math.round(sugars),
        status: getNutrientStatus('sugar', sugars),
        daily: sugarDaily
      },
      protein: {
        value: Math.round(protein),
        status: getNutrientStatus('protein', protein),
        daily: proteinDaily
      },
      fiber: {
        value: Math.round(fiber),
        status: getNutrientStatus('fiber', fiber),
        daily: fiberDaily
      },
      sodium: {
        value: Math.round(sodium),
        status: getNutrientStatus('sodium', sodium),
        daily: sodiumDaily
      },
      satFat: {
        value: Math.round(satFat),
        status: getNutrientStatus('satfat', satFat),
        daily: satFatDaily
      }
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
