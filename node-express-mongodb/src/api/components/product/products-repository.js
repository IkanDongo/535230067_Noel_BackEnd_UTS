const { Product } = require('../../../models');

/**
 * Get a list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Promise}
 */
async function getProducts(page_number, page_size, search, sort) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'category') {
    filter = { category: { $regex: search[1], $options: 'i' } };
  }

  let sorting = {};
  var sort = sort.split(':');
  sorting[sort[0]] = sort[1];

  const Products = Product.find(filter)
    .skip(page_number * page_size)
    .limit(page_size)
    .sort(sorting);
  return Products;
}

async function getProductCount(page_number, page_size, search) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'email') {
    filter = { email: { $regex: search[1], $options: 'i' } };
  } else if (search[0] === 'name') {
    filter = { name: { $regex: search[1], $options: 'i' } };
  }

  const count = Product.countDocuments(filter);
  return count;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createProduct(product, quantity, price) {
  return Product.create({
    product,
    quantity,
    price,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateProduct(product, price, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product,
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  getProducts,
  getProductCount,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
