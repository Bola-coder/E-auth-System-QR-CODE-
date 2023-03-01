const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const jsqr = require("jsqr");
const Jimp = require("jimp");
const https = require("https");
const axios = require("axios");
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

const generateQRCode = () => {
  const qrData = generateRandomString(6);
  //   console.log(qrData);
  qrcode.toDataURL(qrData, function (err, url) {
    if (err) console.error(err);
    console.log("QRCODE DATA:", url);
    return url;
  });
};

const readQRData = () => {
  const url = generateQRCode();
  // Load the QR code image
  const image_url = url; // Replace with actual image URL

  // https.get(image_url, (res) => {});

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // set the port number here
    // other options
  });
  axiosInstance
    .get(image_url)
    .then(function (res) {
      let data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        const buffer = Buffer.concat(data);
        Jimp.read(buffer, function (err, image) {
          if (err) console.error(err);
          const width = image.bitmap.width;
          const height = image.bitmap.height;
          const pixels = new Uint8ClampedAr() - ray(width * height * 4);
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
              pixels[idx] = rgba.r;
              pixels[idx + 1] = rgba.g;
              pixels[idx + 2] = rgba.b;
              pixels[idx + 3] = rgba.a;
            }
          }
          const code = jsqr(pixels, width, height);
          if (code) {
            const decoded_str = code.data;
            console.log(decoded_str);
          } else {
            console.log("QR code not found or not readable");
          }
        });
      });
    })
    .catch((err) => {
      console.log("Axios error", err);
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
  // generateQRCode(user);
  readQRData();
  const token = signJwt(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

module.exports = { login, signup, readQRData };
