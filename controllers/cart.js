const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Cart = require("./../models/cart");
const Product = require("./../models/product");

// Add product to cart
// Protected
const addProductToCart = CatchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { _id: userId } = req.user;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Check if the user has an existing cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // If the user doesn't have an existing cart, create one
    cart = await Cart.create({ user: userId });
  }

  // Check if the product is already in the cart
  const productIndex = cart.products.findIndex((p) => p.product == productId);

  if (productIndex === -1) {
    // If the product is not already in the cart, add it
    cart.products.push({ product: productId, quantity });
  } else {
    // If the product is already in the cart, increase the quantity
    cart.products[productIndex].quantity += quantity;
  }

  // Save the changes to the cart
  await cart.save();
  res.status(201).json({
    status: "success",
    cartLenght: cart.length,
    cart,
  });
});

// Get all products in User cart
const getCart = CatchAsync(async (req, res) => {
  const { _id: userId } = req.user;

  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product",
    "name price"
  );

  if (!cart) {
    return next(new AppError("User's cart not found!", 404));
  }

  res.status(200).json({
    status: "success",
    cartLenght: cart.length,
    cart,
  });
});

// Remove product from cart
const removeFromCart = CatchAsync(async (req, res) => {
  const { productId } = req.params;
  const { _id: userId } = req.user;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError("Cart not found!", 404));
  }

  const productIndex = cart.products.findIndex(
    (product) => product.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(new AppError("Product not found in cart!", 404));
  }

  cart.products.splice(productIndex, 1);
  await cart.save();

  res.status(200).json({
    status: "success",
    cartLenght: cart.length,
    cart,
  });
});

module.exports = { addProductToCart, getCart, removeFromCart };
