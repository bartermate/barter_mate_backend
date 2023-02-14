const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
pincode: {
    type: String,
    //required: true,
  },
  category: {
    type: String,
    // required: true
  },
  value: {
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
const Rate = mongoose.model("rate", schema);

module.exports = Rate;
