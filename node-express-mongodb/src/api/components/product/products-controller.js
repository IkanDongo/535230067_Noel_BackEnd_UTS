const olshopsService = require('../olshop/olshops-service');
const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const page_number = parseInt(request.query.page_number) - 1 || 0;
    const page_size = parseInt(request.query.page_size) || 1 / 0;
    const search = request.query.search || '';
    const sort = request.query.sort || 'name:asc';
    const users = await productsService.getProducts(
      page_number,
      page_size,
      search,
      sort
    );

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const order = await productsService.getProduct(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown order');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const product = request.body.product;
    const quantity = request.body.quantity;
    const price = request.body.price;

    const itemIsRegistered = await productsService.itemIsRegistered(product);
    if (itemIsRegistered) {
      throw errorResponder(
        errorTypes.ITEM_ALREADY_TAKEN,
        'Item is already registered'
      );
    }

    const success = await productsService.createProduct(
      product,
      quantity,
      price
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create Product'
      );
    }

    return response.status(200).json({
      product,
      quantity,
      price,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const itemIsRegistered = await productsService.itemIsRegistered(product);
    if (itemIsRegistered) {
      throw errorResponder(
        errorTypes.ITEM_ALREADY_TAKEN,
        'Item is already registered'
      );
    }

    const success = await productsService.updateProduct(
      id,
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }
    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete order'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateStock(request, response, next) {
  try {
    const id = request.params.id;
    const quantity = request.body.quantity;

    const success = await productsService.updateStock(id, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update stock'
      );
    }

    return response.status(200).json({ id, quantity });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
