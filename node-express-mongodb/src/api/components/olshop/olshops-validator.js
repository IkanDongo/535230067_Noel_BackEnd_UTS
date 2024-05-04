const joi = require('joi');

module.exports = {
  createOlshop: {
    body: {
      customer_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Customer_name'),
      address: joi.string().min(1).max(100).required().label('Address'),
      product: joi.string().min(1).max(100).required().label('Product'),
      invoice: joi.string().min(1).max(100).required().label('Invoice'),
      price: joi.string().min(1).max(100).required().label('Price'),
      quantity: joi.string().min(1).max(100).required().label('Quantity'),
      date_checkout: joi.date().iso().required().label('Date_Checkout'),
    },
  },

  updateOlshop: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      price: joi.string().min(1).max(100).required().label('Price'),
      quantity: joi.string().min(1).max(100).required().label('Quantity'),
    },
  },
};
