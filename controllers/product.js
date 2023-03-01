const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Products = require("./../models/product");

const getAllProducts = CatchAsync(async (req, res, next) => {
  const products = await Products.find();
  if (!products) {
    return next(new AppError("Failed to fetch products", 404));
  }

  res.status(200).json({
    result: Products.length,
    status: "success",
    data: {
      products,
    },
  });
});

const createProduct = CatchAsync(async (req, res, next) => {
  // const {name, description, price, category, image, quantity} = req.body;

  const newProduct = await Products.create(req.body);

  if (!newProduct) {
    return next(new AppError("Failed to create new product!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      newProduct,
    },
  });
});

module.exports = { getAllProducts, createProduct };
