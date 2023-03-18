const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const User = require("./../models/userModel");
const CatchAsync = require("./../utils/CatchAsync");
const { promisify } = require("util");

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

const generateQRCode = async (user) => {
  let output = "";
  const userEmail = user.email;
  const randomString = generateRandomString(6);
  const qrData = userEmail + "*" + randomString;
  // Save QRData to database
  const currentUser = await User.findById(user._id);
  currentUser.qrData = qrData;
  currentUser
    .save()
    .then((doc) => {
      // console.log("Saving qr data", doc);
    })
    .catch((err) => {
      console.log("Saving QR DATA Error", err);
    });
  // Return the generated QRData
  return promisify(qrcode.toDataURL)(qrData)
    .then((url) => {
      output = url;
      return output;
    })
    .catch((err) => {
      throw err;
    });
  // return output;
};

// ROUTE: /auth/signup
// Signup users
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

  generateQRCode(newUser)
    .then((output) => {
      newUser.qrCode = output;
      let code = output;
      newUser
        .save()
        .then((doc) => {
          // console.log("After saving document", doc);
          code = doc.qrCode;
        })
        .catch((err) => {
          console.log(err);
          return next(new AppError("Login Failed", 404));
        });

      res.status(200).json({
        status: "success",
        id: newUser._id,
      });
    })
    .catch((err) => {
      console.log("Error", err);
      return next(new AppError("Failed to generate QR Code", 404));
    });
});

// ROUTE: /auth/login
// Login Users
const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(`Invalid email or password`, 401));
  }
  generateQRCode(user)
    .then((output) => {
      user.qrCode = output;
      let code = output;
      user
        .save()
        .then((doc) => {
          // console.log("After saving document", doc);
          code = doc.qrCode;
        })
        .catch((err) => {
          console.log(err);
          return next(new AppError("Login Failed", 404));
        });

      res.status(200).json({
        status: "success",
        id: user._id,
      });
    })
    .catch((err) => {
      console.log("Error", err);
      return next(new AppError("Failed to generate QR Code", 404));
    });
});

// ROUTE: none
// Protect Route from being accessed by anauthorised users
const protectRoute = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to get access to this route!",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JwtSecret);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError("The user this token belongs to does no longer exist!.", 401)
    );
  }

  req.user = user;
  next();
});

// Restrict Route Access
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action")
      );
    }
    next();
  };
};

// @ROUTE: /auth/verify
// Verify User based on The QRCODE
const verifyUserBasedOnQRCode = CatchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById({ _id: userId });
  if (!user) {
    return next(
      new AppError("No user with the verification code supplied", 404)
    );
  }
  console.log("User is", user);
  res.status(200).json({
    status: "success",
    code: user.qrCode,
    // message: "Authenticated fully",
  });
});

// @ROUTE: /auth/confirm
// Confirm user and send token
const confirmUser = CatchAsync(async (req, res, next) => {
  const { qrData } = req.body;
  const user = await User.findOne({ qrData: qrData });
  if (!user) {
    return next(
      new AppError("failed to authenticate user with the supplied qrcode", 401)
    );
  }
  const token = signJwt(user._id);
  const { name, _id, email, role } = user;
  res.status(200).json({
    status: "success",
    token,
    user: {
      _id,
      name,
      email,
      role,
    },
  });
});

module.exports = {
  login,
  signup,
  generateQRCode,
  protectRoute,
  restrictTo,
  verifyUserBasedOnQRCode,
  confirmUser,
};
