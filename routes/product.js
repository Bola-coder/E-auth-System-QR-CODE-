const express = require("express");
const upload = require("./../middlewares/fileUpload");
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("./../controllers/product");
const { protectRoute } = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protectRoute, upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .patch(protectRoute, updateProduct)
  .delete(protectRoute, deleteProduct);

module.exports = router;
