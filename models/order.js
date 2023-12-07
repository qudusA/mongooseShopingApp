const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  //   cartId: {},

  title: {
    type: String,
  },

  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("order", orderSchema);
