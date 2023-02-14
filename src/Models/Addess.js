const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'registration'
  },
  email: {
    type: String,
    // required: true
  },
  phone: {
    type: Number,
    // required: true
  },
  address1: {
    type: String,
    // required: true
  },
  address2: {
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
  city: {
    type: String,
    // required: true
  },
  state: {
    type: String,
    // required: true
  },
  tags:{
    type: String,
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
const Address = mongoose.model("address", schema);

module.exports = Address;
