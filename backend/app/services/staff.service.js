const Staff = require("../models/staff.model");
const User = require("../models/user.model");
const userService = require("./user.service");
const Role = require("../enums/role.enum");

const createStaff = async (staffData) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findById(staffData._id);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await userService.createUser({
      email: staffData.email,
      password: staffData.password,
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      role: Role.STAFF,
    });

    // Count the number of existing staff members
    const staffCount = await Staff.countDocuments();
    const staffId = `NV${String(staffCount + 1).padStart(3, "0")}`;

    // Create a new staff member
    const newStaff = new Staff({
      _id: newUser._id,
      staffId: staffId,
    });
    await newStaff.save();

    return newStaff;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

const seedStaff = async () => {
  try {
    const staffExist = await User.countDocuments({ role: "staff" });

    if (staffExist > 0) {
      console.log("Staff account already exists. Skipping seed.");
      return;
    }

    const defaultStaff = {
      email: "staff001@gmail.com",
      password: "12345678",
      firstName: "Staff",
      lastName: "001",
    };

    const newStaff = await createStaff(defaultStaff);
    const staffFullInfo = await newStaff.getUserInfo();
    console.log("Default staff account created:", staffFullInfo);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createStaff,
  seedStaff,
};
