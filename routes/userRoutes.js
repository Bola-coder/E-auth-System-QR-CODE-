const express = require("express");
const { getAllUsers } = require("./../controllers/userController");
const { protectRoute, restrictTo } = require("./../controllers/authController");
const router = express.Router();

router.route("/").get(protectRoute, restrictTo("admin"), getAllUsers);

module.exports = router;
