const mongoose = require("mongoose");

/**
 * MongoDB utility class for connecting to a MongoDB database.
 */
class MongoDB {
  static connect = async (uri) => {
    if (this.client) return this.client;
    this.client = await mongoose.connect(uri);
    return this.client;
  };
}

module.exports = MongoDB;
