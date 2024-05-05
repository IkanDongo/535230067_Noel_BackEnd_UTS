const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const olshop = require('./components/olshop/olshops-route');
const product = require('./components/product/products-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  olshop(app);
  product(app);

  return app;
};
