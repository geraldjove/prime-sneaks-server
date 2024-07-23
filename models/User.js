const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "required First Name"],
  },
  lastName: {
    type: String,
    required: [true, "required Last Name"],
  },
  contactEmail: {
    type: String,
    required: [true, "required Contact Email"],
  },
  contactPhone: {
    type: String,
    required: [true, "required Contact Phone"],
  },
  contactAddress: {
    type: String,
    required: [true, "required Physical Address"],
  },
  password: {
    type: String,
    required: [true, "required password"],
  },
  birthDate: {
    type: Date,
    required: [true, Date.now],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
