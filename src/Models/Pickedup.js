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
  category:{
    type: String,
  },
  pickupDate: {
    type: Date,
    // required: true
  },
  shift: {
    type: String,
    // required: true
  },
  remark: {
    type: String,
    // required: true
  },
  feedback: {
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
const Pickedup = mongoose.model("pickedup", schema);

module.exports = Pickedup;
