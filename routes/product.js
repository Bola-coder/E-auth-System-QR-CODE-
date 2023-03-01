const express = require("express");
const { getAllProducts, createProduct } = require("./../controllers/product");

const router = express.Router();
router.route("/").get(getAllProducts).post(createProduct);
// router.route("/").get(getAllProducts);

module.exports = router;
