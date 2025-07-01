const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    _id: { type: String, ref: "User" },
    staffId: { type: String, unique: true, required: true },
  },
  {
    _id: false, // không để Mongoose tự sinh ObjectId
    versionKey: false, // không sử dụng trường __v
  }
);

// Instance method
staffSchema.methods.getUserInfo = async function () {
  await this.populate("_id");

  const data = this.toObject();
  data.user = data._id;
  delete data._id;

  return data;
};

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
