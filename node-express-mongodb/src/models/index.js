const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const usersAttempt = require('./users-attempt');
const olshopsSchema = require('./olshops-schema');
const productsSchema = require('./products-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Attempt = mongoose.model('attempt', mongoose.Schema(usersAttempt));
const Olshop = mongoose.model('olshops', mongoose.Schema(olshopsSchema));
const Product = mongoose.model('products', mongoose.Schema(productsSchema));

module.exports = {
  mongoose,
  User,
  Attempt,
  Olshop,
  Product,
};
