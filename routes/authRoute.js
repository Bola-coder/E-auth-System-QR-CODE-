const express = require("express");
const {
  signup,
  login,
  verifyUserBasedOnQRCode,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verify/:userId").get(verifyUserBasedOnQRCode);

module.exports = router;
