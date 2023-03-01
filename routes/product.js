const express = require("express");
const upload = require("./../middlewares/fileUpload");
const { getAllProducts, createProduct } = require("./../controllers/product");

const router = express.Router();
router
  .route("/")
  .get(getAllProducts)
  .post(upload.single("image"), createProduct);
// router.route("/").get(getAllProducts);

module.exports = router;
