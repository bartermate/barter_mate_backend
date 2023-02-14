const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  pincode: {
    type: String,
     required: true
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
const Pincode = mongoose.model("pincode", schema);

module.exports = Pincode;
