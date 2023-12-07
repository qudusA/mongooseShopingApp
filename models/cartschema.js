const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  title: {
    type: String,
  },

  quantity: {
    type: Number,
  },

  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = cartSchema;
