const olshopsRepository = require('./olshops-repository');

/**
 * Get list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Array}
 */

async function getOlshops(page_number, page_size, search, sort) {
  const users = await olshopsRepository.getOlshops(
    page_number,
    page_size,
    search,
    sort
  );
  const totalcount = await olshopsRepository.getOlshopsCount(
    page_number,
    page_size,
    search
  );
  const totalpages = Math.ceil(totalcount / page_size);
  const previouspage = page_number > 1;
  const nextpage = page_number < totalpages;

  const results = {
    page_number: page_number + 1,
    page_size: page_size,
    count: totalcount,
    total_pages: totalpages,
    has_previous_page: previouspage,
    has_next_page: nextpage,
    users: userss(users),
  };

  function userss(users) {
    const results = [];
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
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
async function getOlshop(id) {
  const olshop = await olshopsRepository.getOlshop(id);
  // User not found
  if (!olshop) {
    return null;
  }

  return {
    customer_name: olshop.customer_name,
    address: olshop.address,
    product: olshop.product,
    invoice: olshop.invoice,
    price: olshop.price,
    quantity: olshop.quantity,
    date_checkout: olshop.date_checkout,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createOlshop(
  customer_name,
  address,
  product,
  invoice,
  price,
  quantity,
  date_checkout
) {
  try {
    await olshopsRepository.createOlshop(
      customer_name,
      address,
      product,
      invoice,
      price,
      quantity,
      date_checkout
    );
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
async function updateOlshop(product, price, quantity) {
  const order = await olshopsRepository.getOlshop(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await olshopsRepository.updateOlshop(product, price, quantity);
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
async function deleteOlshop(id) {
  const order = await olshopsRepository.getOlshop(id);

  // User not found
  if (!order) {
    return null;
  }

  try {
    await olshopsRepository.deleteOlshop(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getOlshops,
  getOlshop,
  createOlshop,
  updateOlshop,
  deleteOlshop,
};
