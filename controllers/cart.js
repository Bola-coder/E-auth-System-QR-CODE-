const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const Cart = require("./../models/cart");
const Product = require("./../models/product");

// Add product to cart
// Protected
const addProductToCart = CatchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const quantity = req.body;

  const product = await Product.findById(productId);

  // Get the product with the specified product ID.
  if (!product) {
    return next(new AppError("Product with the specified ID not found", 404));
  }

  // Get the cart based on the id of the currently logged in user.
  const userId = req.user._id;
  let cart = await Cart.findOne(userId);
  if (!cart) {
    // If the user doesn't have a cart yet, create one for the user
    cart = new Cart({ userId });
  }

  // Check if the product is already in cart
  const existingProduct = cart.products.find((prod) =>
    prod.product.equals(productId)
  );
  if (existingProduct) {
    // Increase the product quantity by one.
    // existingProduct.quantity += quantity || 1;
    return next(new AppError("Products exist in cart already!"));
  } else {
    // Push the products to the cart
    cart.products.push({ product: productId, quantity: quantity || 1 });
  }

  // Save the updated cart:
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item added to cart",
    data: {
      cart,
    },
  });
});

module.exports = { addProductToCart };
