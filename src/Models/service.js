const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'registration'
  },
  serviceName: {
    type: String,
    // required: true
  },
  isService: {
    type: Boolean,
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
const Service = mongoose.model("service", schema);

module.exports = Service;
