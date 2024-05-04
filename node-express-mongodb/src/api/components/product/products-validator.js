const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      price: joi.string().min(1).max(100).required().label('Price'),
      quantity: joi.string().min(1).max(100).required().label('Quantity'),
    },
  },

  updateProduct: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      price: joi.string().min(1).max(100).required().label('Price'),
      quantity: joi.string().min(1).max(100).required().label('Quantity'),
    },
  },
};
