const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */

const attempt = {};

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  //increment login for the login attempt
  attempt[email] = (attempt[email] || 1) + 1;

  //its for the timer if reach 6
  if (attempt[email] >= 6){
    setTimeout(() => {
      delete attempt[email];} , 30000);
  }
  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    attempt[email] = 1;
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
 */
function getLoginAttempts(email){
  return attempt[email] || 1;
  
}
/**
 * Create new attempt
 * @param {string} email - Email
 * @param {string} attempt - Password
 * @returns {boolean}
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
 * @returns {boolean}
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
