const jwt = require("jsonwebtoken");

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
