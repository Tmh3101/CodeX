require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/codex",
  },
};

module.exports = config;
