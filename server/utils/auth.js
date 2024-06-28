const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'secretKEY'; // Update with a secure secret key
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      // Remove 'Bearer ' from token string
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req; // Return the original req object if no token found
    }

    try {
      const { data } = jwt.verify(token, secret);
      req.user = data; // Attach user data to req object if token is valid
    } catch (error) {
      console.error('Invalid token:', error.message);
      throw new AuthenticationError('Invalid token');
    }

    return req; // Return req object with or without user data
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
