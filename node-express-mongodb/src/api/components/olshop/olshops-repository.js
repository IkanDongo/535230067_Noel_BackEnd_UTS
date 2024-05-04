const { Olshop } = require('../../../models');
const { product } = require('../../../models/olshops-schema');

/**
 * Get a list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Promise}
 */
async function getOlshops(page_number, page_size, search, sort) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'category') {
    filter = { category: { $regex: search[1], $options: 'i' } };
  }

  let sorting = {};
  var sort = sort.split(':');
  sorting[sort[0]] = sort[1];

  const olshops = Olshop.find(filter)
    .skip(page_number * page_size)
    .limit(page_size)
    .sort(sorting);
  return olshops;
}

async function getOlshopCount(page_number, page_size, search) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'email') {
    filter = { email: { $regex: search[1], $options: 'i' } };
  } else if (search[0] === 'name') {
    filter = { name: { $regex: search[1], $options: 'i' } };
  }

  const count = Olshop.countDocuments(filter);
  return count;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getOlshop(id) {
  return Olshop.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createOlshop(
  customer_name,
  address,
  product,
  price,
  quantity,
  invoice,
  date_checkout
) {
  return Olshop.create({
    customer_name,
    address,
    product,
    price,
    quantity,
    invoice,
    date_checkout,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateOlshop(id, product, price, quantity) {
  return Olshop.updateOne(
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
async function deleteOlshop(id) {
  return Olshop.deleteOne({ _id: id });
}

module.exports = {
  getOlshops,
  getOlshopCount,
  getOlshop,
  createOlshop,
  updateOlshop,
  deleteOlshop,
};
