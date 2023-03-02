const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Products = require("./../models/product");

// Get All products in database
//public
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

// Create a new product
// Protected
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

//Get a Single Prodict
//public
const getProduct = CatchAsync(async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  if (!product) {
    return next(
      new AppError("product with the specified ID is not found", 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

//Update Product
// protected
const updateProduct = CatchAsync(async (req, res, next) => {
  const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(
      new AppError("Product with the specified ID is not found!", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

//Delete Product
// protected
const deleteProduct = CatchAsync(async (req, res, next) => {
  const product = await Products.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new AppError("Product with the specified ID is not found", 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
