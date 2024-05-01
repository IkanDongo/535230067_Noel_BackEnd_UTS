const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */

async function checkLoginCredentials(email, password, attempt) {
  // Jika sudah, tambahkan 1 ke nilai attempt[email] (karena ini adalah percobaan baru)
  attempt++;
  authenticationRepository.updateAttempt(email, attempt);

  const user = await authenticationRepository.getUserByEmail(email, attempt);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  //its for the timer if reach 6
  if (attempt >= 6) {
    attempt = 1;
    setTimeout(
      () => authenticationRepository.updateAttempt(email, attempt),
      18000
    );
  }
  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    attempt = 1;
    authenticationRepository.updateAttempt(email, attempt);
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}
/**
 * Get the login attempt number
 * @param {string} email - Email
 * @param {string} attempt - Email
 * @returns {Promise}
 */
async function getLoginAttempts(email) {
  const update = await authenticationRepository.getLoginAttempts(email);
  if (!update) {
    return null;
  }
  return update.attempt;
}
/**
 * Create new attempt
 * @param {string} email - Email
 * @param {string} attempt - Password
 * @returns {Promise}
 */
async function createAttempt(email, attempt) {
  try {
    await authenticationRepository.createAttempt(email, attempt);
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
 * @returns {Promise}
 */
async function updateAttempt(email, attempt) {
  try {
    await authenticationRepository.updateAttempt(email, attempt);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  checkLoginCredentials,
  getLoginAttempts,
  createAttempt,
  updateAttempt,
};
