const express = require("express");
const upload = require("./../middlewares/fileUpload");
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("./../controllers/product");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(upload.single("image"), createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
