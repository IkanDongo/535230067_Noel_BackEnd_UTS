const ProductsRepository = require('./products-repository');

/**
 * Get list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Array}
 */

async function getProducts(page_number, page_size, search, sort) {
  const Products = await ProductsRepository.getProducts(
    page_number,
    page_size,
    search,
    sort
  );
  const totalcount = await ProductsRepository.getProductCount(
    page_number,
    page_size,
    search
  );
  const totalpages = Math.ceil(totalcount / page_size);
  const previouspage = page_number > 1;
  const nextpage = page_number < totalpages - 1;

  const results = {
    page_number: page_number + 1,
    page_size: page_size,
    count: totalcount,
    total_pages: totalpages,
    has_previous_page: previouspage,
    has_next_page: nextpage,
    Products: Productss(Products),
  };

  function Productss(Products) {
    const results = [];
    for (let i = 0; i < Products.length; i += 1) {
      const Product = Products[i];
      results.push({
        product: Product.product,
        quantity: Product.quantity,
        price: Product.price,
      });
    }
    return results;
  }
  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getProduct(id) {
  const Product = await ProductsRepository.getProduct(id);
  // User not found
  if (!Product) {
    return null;
  }

  return {
    product: Product.product,
    quantity: Product.quantity,
    price: Product.price,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */

async function createProduct(product, quantity, price) {
  try {
    await ProductsRepository.createProduct(product, quantity, price);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateProduct(id, product, price, quantity) {
  const order = await ProductsRepository.getProduct(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await ProductsRepository.updateProduct(id, product, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const order = await ProductsRepository.getProduct(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await ProductsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
