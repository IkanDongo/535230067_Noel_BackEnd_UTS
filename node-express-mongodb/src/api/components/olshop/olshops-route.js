const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const olshopsControllers = require('./olshops-controller');
const olshopsValidator = require('./olshops-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/olshop', route);

  // Get list of users
  route.get('/', authenticationMiddleware, olshopsControllers.getOlshops);

  // Create user
  route.post(
    '/purchases',
    authenticationMiddleware,
    celebrate(olshopsValidator.createOlshop),
    olshopsControllers.createOlshop
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, olshopsControllers.getOlshop);

  // Update user
  route.put(
    '/purchases/:id',
    authenticationMiddleware,
    celebrate(olshopsValidator.updateOlshop),
    olshopsControllers.updateOlshop
  );

  // Delete user
  route.delete(
    '/purchases/:id',
    authenticationMiddleware,
    olshopsControllers.deleteOlshop
  );
};
