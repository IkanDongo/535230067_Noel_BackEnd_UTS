const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/product', route);

  // Get list of users
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Create user
  route.post(
    '/products',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get user id detail
  route.get('/:id', authenticationMiddleware, productsControllers.getProduct);

  // Update user
  route.put(
    '/products/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete user
  route.delete(
    '/products/:id',
    authenticationMiddleware,
    productsControllers.deleteProduct
  );
};
