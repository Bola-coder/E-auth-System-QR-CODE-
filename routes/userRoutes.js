const express = require("express");
const { getAllUsers, deleteUser } = require("./../controllers/userController");
const { protectRoute, restrictTo } = require("./../controllers/authController");
const router = express.Router();

router.route("/").get(protectRoute, restrictTo("admin"), getAllUsers);
router
  .route("/:id")
  .delete(protectRoute, restrictTo("admin", "superadmin"), deleteUser);

module.exports = router;
