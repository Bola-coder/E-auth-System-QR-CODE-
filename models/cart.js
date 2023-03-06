const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    red: "User",
    required: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  dateAdded: {
    type: Date,
    defualt: Date.now,
  },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
