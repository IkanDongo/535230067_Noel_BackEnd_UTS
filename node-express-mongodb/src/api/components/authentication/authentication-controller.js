const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');
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
  const currenttime = new Date().toLocaleString();
  // check login attempt
  try {
    let attempt = await authenticationServices.getLoginAttempts(email);
    if (attempt >= 6) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `${currenttime} Too many failed login attempts. Your account have been locked 30 minutes, please try again later`
      );
    }
    if (!attempt) {
      attempt = 1;
      const create = authenticationServices.createAttempt(email, attempt);
      if (!create) {
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          `cannot create attempt`
        );
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password,
      attempt
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

module.exports = {
  login,
};
