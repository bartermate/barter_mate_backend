const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true
  },
  phone: {
    type: Number,
    // required: true
  },
  password:{
    type: String,
  },
  address: {
    type: String,
    // required: true
  },
  landMark: {
    type: String,
    // required: true
  },
  pinCode: {
    type: String,
    // required: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const Registration = mongoose.model("registration", schema);

module.exports = Registration;
