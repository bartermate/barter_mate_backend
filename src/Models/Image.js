const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    image:[{
        image:{type: String},
    }]
});
const Image = mongoose.model("image", schema);

module.exports = Image;
