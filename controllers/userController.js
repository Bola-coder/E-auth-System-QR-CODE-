const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const CatchAsync = require("./../utils/CatchAsync");

const getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError("Failed to get users", 404));
  }
  // const currentUser = users.find((user) => user._id === req.user._id);
  // newUsers = users.filter((user) => user._id !== currentUser?._id);
  res.status(200).json({
    result: users.lemgth,
    status: "success",
    users,
  });
});

// const updateUser = CatchAsync(async (req, res, next) => {
//   const { userId } = req.params;
// });

const deleteUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { active: false });

  if (!user) {
    return next(new AppError("Failed to delete user", 404));
  }

  res.status(200).json({
    status: "sucess",
    message: "User deleted sucessfully!",
  });
});

module.exports = { getAllUsers, deleteUser };
