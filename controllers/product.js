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
  console.log(req.body);

  const newProduct = new Products(req.body);
  newProduct.imageFile = req.file;
  await newProduct.save();

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
