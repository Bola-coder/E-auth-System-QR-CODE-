const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorControlelr");

const app = express();
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);
app.use(errorController);

module.exports = app;
