const joi = require('joi');
const { updateStock } = require('./products-repository');

module.exports = {
  createProduct: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      quantity: joi.number().min(1).max(100).required().label('Quantity'),
      price: joi.string().min(1).max(100).required().label('Price'),
    },
  },

  updateProduct: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      quantity: joi.number().min(1).max(100).required().label('Quantity'),
      price: joi.string().min(1).max(100).required().label('Price'),
    },
  },
  updateStock: {
    body: {
      quantity: joi.number().min(1).max(100).required().label('Quantity'),
    },
  },
};
