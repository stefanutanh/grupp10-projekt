import axios from './api';

// Hjälpfunktion för att hantera data från servern
function extractData(response) {
  if (response && response.data) {
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  }
  return response;
}

export async function getAll(endpoint = '/cart') {
  try {
    const response = await axios.get(endpoint);
    console.log("Raw cart response:", response.data);
    const data = extractData(response);

    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Fel vid hämtning av varukorg:', e?.response?.data || e.message || e);
    return [];
  }
}

// Hämta användarens varukorg
export async function getCart(userId) {
  try {
    const response = await axios.get(`/cart/user/${userId}`);
    console.log(`Cart for user ${userId}:`, response.data);
  
    const data = extractData(response);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Fel vid hämtning av varukorg:', e?.response?.data || e.message || e);
    return [];
  }
}

// Lägg till produkt i varukorgen
export async function addToCart(userId, productId, amount) {
  try {
    console.log(`Adding to cart: User ${userId}, Product ${productId}, Amount ${amount}`);
    const response = await axios.post('/cart/addProduct', {
      userId,
      productId,
      amount
    });
    
    console.log("Add to cart response:", response.data);
    return extractData(response);
  } catch (e) {
    console.error('Fel vid tillägg i varukorg:', e?.response?.data || e.message || e);
    return null;
  }
}

// Uppdatera antal av en produkt i varukorgen
export async function updateCartItem(cartRowId, amount) {
  try {
    console.log(`Updating cart item: Row ${cartRowId}, Amount ${amount}`);
    const response = await axios.put('/cart/updateProduct', {
      cartRowId,
      amount
    });
    return extractData(response);
  } catch (e) {
    console.error('Fel vid uppdatering av varukorg:', e?.response?.data || e.message || e);
    return null;
  }
}

// Ta bort en produkt från varukorgen
export async function removeFromCart(cartRowId) {
  try {
    console.log(`Removing item from cart: Row ${cartRowId}`);
    const response = await axios.delete('/cart/removeProduct', {
      data: { cartRowId }
    });
    return extractData(response);
  } catch (e) {
    console.error('Fel vid borttagning av produkt:', e?.response?.data || e.message || e);
    return null;
  }
}

// Töm hela varukorgen
export async function clearCart(cartId) {
  try {
    console.log(`Clearing cart: ${cartId}`);
    const response = await axios.delete('/cart', {
      data: { cartId }
    });
    return extractData(response);
  } catch (e) {
    console.error('Fel vid tömning av varukorg:', e?.response?.data || e.message || e);
    return null;
  }
}

// Hjälpfunktion för att ändra mängd
export async function reduceAmount(userId, productId) {
  try {
    const response = await axios.post('/cart/reduceAmount', {
      userId,
      productId
    });
    return extractData(response);
  } catch (e) {
    console.error('Fel vid minskning av antal:', e?.response?.data || e.message || e);
    return null;
  }
}

// Hjälpfunktion för att öka mängd
export async function increaseAmount(userId, productId) {
  try {
    const response = await axios.post('/cart/increaseAmount', {
      userId,
      productId
    });
    return extractData(response);
  } catch (e) {
    console.error('Fel vid ökning av antal:', e?.response?.data || e.message || e);
    return null;
  }
}