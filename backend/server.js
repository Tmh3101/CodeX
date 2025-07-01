const app = require("./app");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");
const staffService = require("./app/services/staff.service");

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

    // Seed the staff data
    await staffService.seedStaff();
    console.log("Staff data seeded successfully.");
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
