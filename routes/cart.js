const express = require("express");
const { addProductToCart } = require("./../controllers/cart");
const { protectRoute } = require("./../controllers/authController");

const router = express.Router();

router.route("/add/:productId").post(protectRoute, addProductToCart);

module.exports = router;
