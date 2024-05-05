const olshopsRepository = require('./olshops-repository');
const productsRepository = require('../product/products-repository');

/**
 * Get list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Array}
 */

async function getOlshops(page_number, page_size, search, sort) {
  const olshops = await olshopsRepository.getOlshops(
    page_number,
    page_size,
    search,
    sort
  );
  const totalcount = await olshopsRepository.getOlshopCount(
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
    olshops: olshopss(olshops),
  };

  function olshopss(olshops) {
    const results = [];
    for (let i = 0; i < olshops.length; i += 1) {
      const olshop = olshops[i];
      results.push({
        customer_name: olshop.customer_name,
        address: olshop.address,
        product: olshop.product,
        price: olshop.price,
        quantity: olshop.quantity,
        invoice: olshop.invoice,
        date_checkout: olshop.date,
      });
    }

    return results;
  }
  return results;
}

/**
 * Get olshop detail
 * @param {string} id -  olshop ID
 * @returns {Object}
 */
async function getOlshop(id) {
  const olshop = await olshopsRepository.getOlshop(id);
  //  olshop not found
  if (!olshop) {
    return null;
  }

  return {
    customer_name: olshop.customer_name,
    address: olshop.address,
    product: olshop.product,
    price: olshop.price,
    quantity: olshop.quantity,
    invoice: olshop.invoice,
    date_checkout: olshop.date,
  };
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
 * @returns {boolean}
 */

async function createOlshop(customer_name, address, product, price, quantity) {
  // making invoice number
  let time = Date.now().toString();
  let random = Math.random().toString(36).substring(2, 8);
  let invoice = time + random;
  //making date checjout
  let date_checkout = new Date();
  try {
    const checkStock = await productsRepository.getProductByName(product);
    if (!checkStock) {
      return null;
    }
    const item = checkStock.quantity - quantity;
    const Stock = await productsRepository.updateStock(checkStock.id, item);
    if (!Stock) {
      return null;
    }
    await olshopsRepository.createOlshop(
      customer_name,
      address,
      product,
      price,
      quantity,
      invoice,
      date_checkout
    );
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Update existing olshop
 * @param {string} id - olshop ID
 * @param {string} product - Product
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {boolean}s
 */
async function updateOlshop(id, product, price, quantity) {
  const checkStock = await productsRepository.getProductByName(product);
  if (!checkStock) {
    return null;
  }
  const item = checkStock.quantity - quantity;
  const Stock = await productsRepository.updateStock(checkStock.id, item);
  if (!Stock) {
    return null;
  }
  const order = await olshopsRepository.getOlshop(id);

  // order not found
  if (!order) {
    return null;
  }

  try {
    await olshopsRepository.updateOlshop(id, product, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete olshop
 * @param {string} id - olshop ID
 * @returns {boolean}
 */
async function deleteOlshop(id) {
  const order = await olshopsRepository.getOlshop(id);

  // order not found
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
