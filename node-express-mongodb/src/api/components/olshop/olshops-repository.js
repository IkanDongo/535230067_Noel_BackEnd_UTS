const { Olshop } = require('../../../models');

/**
 * Get a list of olshop
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Promise}
 */
async function getOlshops(page_number, page_size, search, sort) {
  // function search buat order berdasarkan customer name
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'customer_name') {
    filter = { customer_name: { $regex: search[1], $options: 'i' } };
  }
  // function for sort buat order
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
  if (search[0] === 'customer_name') {
    filter = { customer_name: { $regex: search[1], $options: 'i' } };
  }

  const count = Olshop.countDocuments(filter);
  return count;
}

/**
 * Get olshop detail
 * @param {string} id - olshop ID
 * @returns {Promise}
 */
async function getOlshop(id) {
  return Olshop.findById(id);
}

/**
 * Create new olshop
 * @param {string} customer_name - Cust name
 * @param {string} address - address
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @param {string} invoice - Invoice
 * @param {string} date_checkout - Date of checkout
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
 * Update existing olshop
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
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
 * Delete a olshop
 * @param {string} id - olshop ID
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
