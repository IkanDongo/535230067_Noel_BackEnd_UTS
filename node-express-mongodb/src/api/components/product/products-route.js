const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/catalog', route);

  // Get list of products
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Create product
  route.post(
    '/products',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get product id detail
  route.get('/:id', authenticationMiddleware, productsControllers.getProduct);

  // Update product
  route.put(
    '/products/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Update stock
  route.put(
    '/stock/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateStock),
    productsControllers.updateStock
  );

  // Delete product
  route.delete(
    '/products/:id',
    authenticationMiddleware,
    productsControllers.deleteProduct
  );
};
