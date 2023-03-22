const express = require("express");
const upload = require("./../middlewares/fileUpload");
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductByGender,
} = require("./../controllers/product");
const { protectRoute } = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protectRoute, upload.single("image"), createProduct);

router.route("/latest").get(getLatestProducts);
router.route("/men").get(getProductByGender("men"));
router.route("/women").get(getProductByGender("women"));
router.route("/unisex").get(getProductByGender("unisex"));

router
  .route("/:id")
  .get(getProduct)
  .patch(protectRoute, updateProduct)
  .delete(protectRoute, deleteProduct);

module.exports = router;
