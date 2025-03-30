const db = require('../models');
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage
} = require('../helpers/responseHelper');
const validate = require('validate.js');

const constraints = {
  title: {
    length: {
      minimum: 2,
      maximum: 100,
      tooShort: '^Titeln måste vara minst %{count} tecken lång.',
      tooLong: '^Titeln får inte vara längre än %{count} tecken lång.'
    }
  }
};

async function getById(id) {
  try {
    const product = await db.product.findOne({
      where: { id },
      include: [
        {
          model: db.rating, 
          as: 'ratings', 
          include: [db.user] 
        }
      ]
    });

    if (!product) {
      return createResponseError(404, 'Produkt hittades inte');
    }
    
    /* Om allt blev bra, returnera product */
    return createResponseSuccess(_formatProduct(product));
  } catch (error) {
    return createResponseError(500, error.message);
  }
}

async function getAll() {
  try {
    // Lägg till loggning för felsökning
    const products = await db.product.findAll({
      include: [db.user]
    });
    console.log("Found products:", products.length);
    return createResponseSuccess(products);
  } catch (error) {
    console.error("Error in getAll:", error);
    return createResponseError(500, error.message);
  }
}

async function create(product) {
  const invalidData = validate(product, constraints);
  if (invalidData) {
    return createResponseError(422, invalidData);
  }
  try {
    console.log('Skapar produkt:', product); 
    const newProduct = await db.product.create(product);
    return createResponseSuccess(newProduct);
  } catch (error) {
    return createResponseError(500, error.message);
  }
}

async function update(product, id) {
  const invalidData = validate(product, constraints);
  if (!id) {
    return createResponseError(422, 'Id är obligatoriskt');
  }
  if (invalidData) {
    return createResponseError(422, invalidData);
  }
  try {
    const existingProduct = await db.product.findOne({ where: { id } });
    if (!existingProduct) {
      return createResponseError(404, 'Hittade ingen produkt att uppdatera.');
    }
    
    // Uppdatera produkten
    await db.product.update(product, { where: { id } });
    return createResponseMessage(200, 'Produkten uppdaterades.');
  } catch (error) {
    return createResponseError(500, error.message);
  }
}

async function destroy(id) {
  if (!id) {
    return createResponseError(422, 'Id är obligatoriskt');
  }
  try {
// La till så den kollar med rating //
    await db.rating.destroy({
      where: { productId: id }
    });
    await db.product.destroy({
      where: { id }
    });    
    return createResponseMessage(200, 'Produkten raderades.');
  } catch (error) {
    console.error('Error deleting product:', error);
    return createResponseError(500, error.message);
  }
}
// Formaterar produkten // chatgpt hjälpte till här
function _formatProduct(product) {
  const cleanProduct = {
    id: product.id,
    title: product.title,
    price: product.price,
    body: product.body,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    userId: product.userId
  };

  if (product.user) {
    cleanProduct.author = {
      id: product.user.id,
      username: product.user.username,
      email: product.user.email,
      firstName: product.user.firstName,
      lastName: product.user.lastName,
      imageUrl: product.user.imageUrl
    };
  }

  return cleanProduct;
}

module.exports = {
  getById,
  getAll,
  create,
  update,
  destroy
};