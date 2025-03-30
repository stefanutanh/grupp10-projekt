const db = require('../models');
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage
} = require('../helpers/responseHelper');
const validate = require('validate.js');

const constraints = {
  rating: {
    numericality: {
      onlyInteger: false,
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 5,
      notValid: '^Betyget måste vara mellan 1 och 5'
    }
  }
};

async function addRating(ratingData, productId, userId) {
  if (!productId) {
    return createResponseError(422, 'ProductId är obligatoriskt');
  }

  // Validera betyget
  const invalidData = validate(ratingData, constraints);
  if (invalidData) {
    return createResponseError(422, invalidData);
  }

  try {
    // Kontrollera att produkten finns
    const productExists = await db.product.findByPk(productId);
    if (!productExists) {
      return createResponseError(404, 'Produkten hittades inte');
    }

    // Skapa betyget med koppling till produkt och användare
    const newRating = await db.rating.create({
      rating: ratingData.rating,
      productId: productId,
      userId: userId || 1 // Default till user 1
    });

    // Hämta genomsnittligt betyg för produkten
    const averageRating = await getAverageRating(productId);

    return createResponseSuccess({
      rating: newRating,
      averageRating: averageRating
    });
  } catch (error) {
    return createResponseError(500, error.message);
  }
}

async function getAverageRating(productId) {
  if (!productId) {
    return null;
  }

  try {
    // Hämta alla betyg för produkten
    const ratings = await db.rating.findAll({
      where: { productId }
    });

    if (ratings.length === 0) {
      return 0;
    }

    // Beräkna genomsnittligt betyg
    const sum = ratings.reduce((total, item) => total + item.rating, 0);
    const average = sum / ratings.length;
    
    return parseFloat(average.toFixed(1)); // Avrunda till en decimal
  } catch (error) {
    console.error('Error in getAverageRating:', error);
    return null;
  }
}

async function getRatingsByProductId(productId) {
  if (!productId) {
    return createResponseError(422, 'ProductId är obligatoriskt');
  }

  try {
    const ratings = await db.rating.findAll({
      where: { productId },
      include: [db.user],
      order: [['createdAt', 'DESC']]
    });

    const averageRating = await getAverageRating(productId);

    return createResponseSuccess({
      ratings,
      averageRating,
      count: ratings.length
    });
  } catch (error) {
    return createResponseError(500, error.message);
  }
}

module.exports = {
  addRating,
  getAverageRating,
  getRatingsByProductId
};