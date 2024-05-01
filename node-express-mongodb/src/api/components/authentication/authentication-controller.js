const { attempt } = require('joi');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { email } = require('../../../models/users-schema');
const authenticationServices = require('./authentication-service');
const { Attempt } = require('../../../models');

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
    const email = request.body.email;
    const attempt = request.body.attempt;

    const success = authenticationServices.createAttempt(email, attempt);
    if (!success){
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to create Attempt'
    );
  }

  return response.status(200).json({ email, attempt });
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
async function updateAttempt(request, response, next) {
  try {
    const email = request.body.email;
    const attempt = request.body.attempt;
    
const success = await authenticationServices.updateUser(email, attempt);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }
    return response.status(200).json({email,attempt});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getLoginAttempts(request, response, next) {
  try {
    const attempt = request.params.attempt;

    const success = await authenticationServices.getLoginAttempts(attempt);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({attempt});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  createAttempt,
  updateAttempt,
  getLoginAttempts
};
