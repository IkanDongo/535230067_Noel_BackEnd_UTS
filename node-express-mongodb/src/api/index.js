const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const olshop = require('./components/olshop/olshops-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  olshop(app);

  return app;
};
