const olshopsService = require('../olshop/olshops-service');
const ProductsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
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
    const users = await ProductsService.getProducts(
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
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const order = await ProductsService.getProduct(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown order');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
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
    const success = await ProductsService.createProduct(
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
 * Handle update user request
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

    const success = await ProductsService.updateProduct(
      id,
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ProductsService.deleteProduct(id);
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
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateStock(request, response, next) {
  try {
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await olshopsService.updateProduct(
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ product, quantity });
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
