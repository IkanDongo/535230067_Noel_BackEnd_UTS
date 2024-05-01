const { update } = require('lodash');
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
  const currenttime = new Date();
  // check login attempt
  try {
    const attempt = authenticationServices.getLoginAttempts(email);
    if(attempt >= 6){
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `${currenttime} Too many failed login attempts. Your account have been locked 30 minutes, please try again later`
      );
    }
    const checkAttempt = authenticationServices.getLoginAttempts(email);
    if(checkAttempt){
    const update = authenticationServices.updateAttempt(email, attempt);
      if(!update){
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `cannot update attempt`
      );
    }
  }else{
      const create = authenticationServices.createAttempt(email, attempt);
      if(!create){
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
