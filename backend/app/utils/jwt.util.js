const jwt = require("jsonwebtoken");

/**
 * Decodes a JWT token without verifying its signature.
 * @param {string} token
 * @returns {Object|null} The decoded token payload or null if decoding fails.
 * @throws {Error} If the token is malformed or invalid.
 */
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: false });
    return decoded;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};

module.exports = {
  decodeToken,
};
