const express = require("express");
const {
  signup,
  login,
  verifyUserBasedOnQRCode,
  confirmUser,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verify/:userId").get(verifyUserBasedOnQRCode);
router.route("/confirm").post(confirmUser);

module.exports = router;
