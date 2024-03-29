const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
    unique: [true, "A product name must be unique"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A product should have a description"],
  },
  price: {
    type: Number,
    required: [true, "A product should have a price"],
    min: 0,
  },
  category: {
    type: String,
    enum: ["unisex", "men", "women"],
    default: "unisex",
    required: [true, "A product should have a category"],
  },
  image: {
    type: String,
    required: function () {
      return !this.imageFile;
    },
  },
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  quantity: {
    type: Number,
    required: [true, "A product should have a quantity"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

productSchema
  .virtual("imageFile")
  .get(function () {
    return this._imageFile;
  })
  .set(function (file) {
    this._imageFile = file;
    this.image = file.filename;
  });

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
