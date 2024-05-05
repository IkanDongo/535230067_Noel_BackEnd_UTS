const olshopsService = require('./olshops-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of oslhop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOlshops(request, response, next) {
  try {
    const page_number = parseInt(request.query.page_number) - 1 || 0;
    const page_size = parseInt(request.query.page_size) || 1 / 0;
    const search = request.query.search || '';
    const sort = request.query.sort || 'name:asc';
    const olshops = await olshopsService.getOlshops(
      page_number,
      page_size,
      search,
      sort
    );

    return response.status(200).json(olshops);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get olshop detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOlshop(request, response, next) {
  try {
    const order = await olshopsService.getOlshop(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown order');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create olshop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createOlshop(request, response, next) {
  try {
    const customer_name = request.body.customer_name;
    const address = request.body.address;
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;
    const invoice = request.body.invoice;
    const date_checkout = request.body.date_checkout;

    const success = await olshopsService.createOlshop(
      customer_name,
      address,
      product,
      price,
      quantity,
      invoice,
      date_checkout
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create order'
      );
    }
    return response.status(200).json({
      customer_name,
      address,
      product,
      price,
      quantity,
      invoice,
      date_checkout,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update olshop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOlshop(request, response, next) {
  try {
    const id = request.params.id;
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await olshopsService.updateOlshop(
      id,
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update order'
      );
    }

    return response.status(200).json({ id, product, price, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete olshop request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOlshop(request, response, next) {
  try {
    const id = request.params.id;

    const success = await olshopsService.deleteOlshop(id);
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

module.exports = {
  getOlshops,
  getOlshop,
  createOlshop,
  updateOlshop,
  deleteOlshop,
};
