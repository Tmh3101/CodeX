const app = require("./app");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");

async function startServer() {
  try {
    // Connect to MongoDB
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    // Start the Express server
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
