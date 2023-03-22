const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const CatchAsync = require("./../utils/CatchAsync");

const getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError("Failed to get users", 404));
  }

  res.status(200).json({
    status: "success",
    users,
  });
});

const deleteUser = CatchAsync(async (req, res, next) => {
  const { userId } = request.params;
});

module.exports = { getAllUsers };
