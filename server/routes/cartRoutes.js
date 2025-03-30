const express = require('express');
const cartService = require('../services/cartService');
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage
} = require('../helpers/responseHelper');

const router = express.Router();

// GET /cart
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    let result;
    if (userId) {
      result = await cartService.getUserCart(userId);
    } else {
      result = await cartService.getAllCarts();
    }
    
    res.json(createResponseSuccess(result));
  } catch (error) {
    console.error('Error handling GET /cart:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// GET /cart/user/:userId 
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Getting cart for user: ${userId}`);
    const result = await cartService.getUserCart(userId);
    res.json(createResponseSuccess(result));
  } catch (error) {
    console.error('Error handling GET /cart/user/:userId:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// POST /cart/addProduct 
router.post('/addProduct', async (req, res) => {
  try {
    const { userId, productId, amount } = req.body;
    console.log(`Adding product: userId=${userId}, productId=${productId}, amount=${amount}`);
    
    if (!userId || !productId || !amount) {
      return res.status(400).json(createResponseError('userId, productId, and amount are required'));
    }
    
    const cartItem = await cartService.addToCart(userId, productId, parseInt(amount));
    res.json(createResponseSuccess(cartItem));
  } catch (error) {
    console.error('Error handling POST /cart/addProduct:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// PUT /cart/updateProduct 
router.put('/updateProduct', async (req, res) => {
  try {
    const { cartRowId, amount } = req.body;
    console.log(`Updating product: cartRowId=${cartRowId}, amount=${amount}`);
    
    if (!cartRowId || amount === undefined) {
      return res.status(400).json(createResponseError('cartRowId and amount are required'));
    }
    
    const updatedItem = await cartService.updateCartItem(cartRowId, parseInt(amount));
    res.json(createResponseSuccess(updatedItem));
  } catch (error) {
    console.error('Error handling PUT /cart/updateProduct:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// DELETE /cart/removeProduct 
router.delete('/removeProduct', async (req, res) => {
  try {
    const { cartRowId } = req.body;
    console.log(`Removing product: cartRowId=${cartRowId}`);
    
    if (!cartRowId) {
      return res.status(400).json(createResponseError('cartRowId is required'));
    }
    
    const result = await cartService.removeFromCart(cartRowId);
    res.json(createResponseSuccess(result));
  } catch (error) {
    console.error('Error handling DELETE /cart/removeProduct:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// DELETE /cart 
router.delete('/', async (req, res) => {
  try {
    const { cartId } = req.body;
    console.log(`Clearing cart: ${cartId}`);
    
    if (!cartId) {
      return res.status(400).json(createResponseError('cartId is required'));
    }
    
    const result = await cartService.clearCart(cartId);
    res.json(createResponseSuccess(result));
  } catch (error) {
    console.error('Error handling DELETE /cart:', error);
    res.status(500).json(createResponseError(error.message));
  }
});



// POST /cart/reduceAmount 
router.post('/reduceAmount', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json(createResponseError('userId and productId are required'));
    }
    const cart = await cartService.getOrCreateCart(userId);

    const cartRow = await db.cartRow.findOne({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });
    
    if (!cartRow) {
      return res.status(404).json(createResponseError('Product not found in cart'));
    }
    
    if (cartRow.amount <= 1) {
      await cartService.removeFromCart(cartRow.id);
      return res.json(createResponseSuccess({ removed: true }));
    } else {
      cartRow.amount -= 1;
      await cartRow.save();
      return res.json(createResponseSuccess(cartRow));
    }
  } catch (error) {
    console.error('Error handling POST /cart/reduceAmount:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

// POST /cart/increaseAmount 
router.post('/increaseAmount', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json(createResponseError('userId and productId are required'));
    }
    const cart = await cartService.getOrCreateCart(userId);
    const cartRow = await db.cartRow.findOne({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });
    
    if (!cartRow) {
      return res.json(createResponseSuccess(
        await cartService.addToCart(userId, productId, 1)
      ));
    } else {
      cartRow.amount += 1;
      await cartRow.save();
      return res.json(createResponseSuccess(cartRow));
    }
  } catch (error) {
    console.error('Error handling POST /cart/increaseAmount:', error);
    res.status(500).json(createResponseError(error.message));
  }
});

module.exports = router;