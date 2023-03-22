const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Products = require("./../models/product");
const cloudinary = require("./../utils/cloudinary");

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
  const result = await cloudinary.uploader.upload(req.file.path);
  const newProduct = new Products(req.body);
  newProduct.imageFile = req.file;
  console.log(result);
  newProduct.avatar = result.secure_url;
  newProduct.cloudinary_id = result.public_id;
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

//Get a Single Product
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

// Get Latest product and limit result to 15
// Public
const getLatestProducts = CatchAsync(async (req, res, next) => {
  const latestProducts = await Products.find().sort("-date").limit(15);
  if (!latestProducts) {
    return next(new AppError("Unable to fetch latest products", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      products: latestProducts,
    },
  });
});

// Get products based on gender
// Public
const getProductByGender = (gender) =>
  CatchAsync(async (req, res, next) => {
    const product = await Products.find({ category: gender });
    if (!product) {
      return next(new AppError(`Failed to fetch ${gender} products!`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  });

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductByGender,
};
