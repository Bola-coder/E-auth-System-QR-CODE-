const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/product");
const errorController = require("./controllers/errorControlelr");

const app = express();
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use(errorController);

module.exports = app;
