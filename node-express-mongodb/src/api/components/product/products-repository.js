const { Product } = require('../../../models');

/**
 * Get a list of products
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Promise}
 */
async function getProducts(page_number, page_size, search, sort) {
  //search for list product dari product
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'product') {
    filter = { product: { $regex: search[1], $options: 'i' } };
  }
  //sort for list product
  let sorting = {};
  var sort = sort.split(':');
  sorting[sort[0]] = sort[1];

  const Products = Product.find(filter)
    .skip(page_number * page_size)
    .limit(page_size)
    .sort(sorting);
  return Products;
}
//count for total product that have been search
async function getProductCount(page_number, page_size, search) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'product') {
    filter = { product: { $regex: search[1], $options: 'i' } };
  }

  const count = Product.countDocuments(filter);
  return count;
}

/**
 * Get product detail
 * @param {string} id - product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
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
 * Update existing product
 * @param {string} id - product ID
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function updateProduct(id, product, price, quantity) {
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
 * Update existing stock
 * @param {string} id - product ID
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function updateStock(id, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        quantity,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Get product by name to prevent duplicate product
 * @param {string} product - Product
 * @returns {Promise}
 */
async function getProductByName(product) {
  return Product.findOne({ product });
}

module.exports = {
  getProducts,
  getProductCount,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
  updateStock,
};
