const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search keyword for email
 * @param {string} sort - Sorting by ascending and descending
 * @returns {Promise}
 */
async function getUsers(page_number, page_size, search, sort) {
  // function search buat user
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'email') {
    filter = { email: { $regex: search[1], $options: 'i' } };
  } else if (search[0] === 'name') {
    filter = { name: { $regex: search[1], $options: 'i' } };
  }
  // function search buat user
  let sorting = {};
  var sort = sort.split(':');
  sorting[sort[0]] = sort[1];

  const users = User.find(filter)
    .skip(page_number * page_size)
    .limit(page_size)
    .sort(sorting);
  return users;
}

async function getUserCount(page_number, page_size, search) {
  let filter = {};
  var search = search.split(':');
  if (search[0] === 'email') {
    filter = { email: { $regex: search[1], $options: 'i' } };
  } else if (search[0] === 'name') {
    filter = { name: { $regex: search[1], $options: 'i' } };
  }

  const count = User.countDocuments(filter);
  return count;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getUserCount,
};
