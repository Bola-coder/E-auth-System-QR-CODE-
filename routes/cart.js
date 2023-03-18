const express = require("express");
const {
  addProductToCart,
  getCart,
  removeFromCart,
} = require("./../controllers/cart");
const { protectRoute } = require("./../controllers/authController");

const router = express.Router();

router
  .route("/add")
  .post(protectRoute, addProductToCart)
  .get(protectRoute, getCart);

router.route("/delete/:productId").delete(protectRoute, removeFromCart);

module.exports = router;
