const { User } = require('../../../models');
const { Attempt } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getLoginAttempts(email) {
  return Attempt.findOne({ email });
}

/**
 * Create new attempt
 * @param {string} email - Email
 * @param {string} attempt - Attempt
 * @returns {Promise}
 */
async function createAttempt(email, attempt) {
  return Attempt.create({
    email,
    attempt,
  });
}

/**
 * Update existing attempt
 * @param {string} email - Email
 * @param {string} attempt - Attempt
 * @returns {Promise}
 */
async function updateAttempt(email, attempt) {
  return Attempt.updateOne(
    {
      email: email,
    },
    {
      $set: {
        attempt,
      },
    }
  );
}

module.exports = {
  getUserByEmail,
  getLoginAttempts,
  createAttempt,
  updateAttempt,
};
