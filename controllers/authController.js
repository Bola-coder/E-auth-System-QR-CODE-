const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const jsqr = require("jsqr");
const User = require("./../models/userModel");
const CatchAsync = require("./../utils/CatchAsync");

const signJwt = (id) => {
  return jwt.sign({ id }, process.env.JwtSecret, {
    expiresIn: process.env.JwtExpiry,
  });
};

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const generateQRCode = (user) => {
  const qrData = generateRandomString(6);
  //   console.log(qrData);
  qrcode.toDataURL(qrData, function (err, url) {
    if (err) console.error(err);
    console.log("QRCODE DATA:", url);
  });
};

const signup = CatchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
  });
  if (!newUser) {
    return next(new AppError("Failed to create new user", 400));
  }
  const token = signJwt(newUser._id);
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
    token,
  });
});

const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(`Invalid email or password`, 401));
  }
  generateQRCode(user);
  const token = signJwt(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

module.exports = { login, signup };
