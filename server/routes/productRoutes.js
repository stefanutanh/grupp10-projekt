const router = require("express").Router();
const productsService = require('../services/productsService');
const ratingService = require('../services/ratingService'); // Importera ratingService
const { createResponseSuccess, createResponseError } = require('../helpers/responseHelper');

// Hämta alla produkter
router.get('/', async (req, res) => {
  try {
    const result = await productsService.getAll();
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error in GET /products:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// Hämta specifik produkt med ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Hämtar produkt med ID: ${id}`);
    const result = await productsService.getById(id);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error(`Error in GET /products/${req.params.id}:`, error);
    res.status(500).json(createResponseError(error.message));
  }
});

// Skapa en ny produkt
router.post('/', async (req, res) => {
  try {
    const result = await productsService.create(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error in POST /products:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// Uppdatera produkt
router.put('/:id', async (req, res) => {  
  try {
    console.log('Mottar PUT-förfrågan:', req.params.id);
    console.log('Produktdata:', req.body);
    
    const id = req.params.id;
    const product = req.body;
    
    const result = await productsService.update(product, id);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Fel vid uppdatering:', error);
    res.status(500).json(createResponseError('Ett fel inträffade vid uppdatering av produkten'));
  }
});

// Ta bort en produkt
router.delete('/', async (req, res) => {
  try {
    const id = req.body.id;
    const result = await productsService.destroy(id);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error in DELETE /products:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// Hämta alla ratings för en produkt
router.get('/:id/ratings', async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await ratingService.getRatingsByProductId(productId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error in GET /products/:id/ratings:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// Lägg till rating för en produkt
router.post('/:id/addRating', async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.body.userId || 1; // Default till user 1 
    const result = await ratingService.addRating(req.body, productId, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error in POST /products/:id/addRating:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

module.exports = router;