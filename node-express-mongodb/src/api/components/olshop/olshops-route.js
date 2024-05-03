const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const olshopsControllers = require('./olshops-controller');
const olshopsValidator = require('./olshops-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/Olshop', route);

  // Get list of users
  route.get('/', authenticationMiddleware, olshopsControllers.getOlshops);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(olshopsValidator.createOlshop),
    olshopsControllers.createOlshop
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, olshopsControllers.getOlshops);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(olshopsValidator.updateOlshop),
    olshopsControllers.updateOlshop
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware,
    olshopsControllers.deleteOlshop
  );

  // Change password
  route.post(
    '/:id/change-Olshop',
    authenticationMiddleware,
    celebrate(olshopsValidator.changeOlshop),
    olshopsControllers.changeOlshop
  );
};