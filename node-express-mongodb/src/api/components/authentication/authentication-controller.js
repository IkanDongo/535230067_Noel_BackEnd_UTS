const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  const currenttime = new Date();
  // check login attempt
  try {
    const attempt = authenticationServices.getLoginAttempts(email);
    if(attempt >= 6){
      console.log(attempt)
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `${currenttime} Too many failed login attempts. Your account have been locked 30 minutes, please try again later`
      )
    }
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password for ${email} attempt = ${attempt}`
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}


/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createAttempt(request, response, next) {
  try {
    const name = request.body.name;
    const attempt = request.body.attempt;

  return response.status(200).json({ name, attempt });
} catch (error) {
  return next(error);
}
}

module.exports = {
  login,
  createAttempt,
};
