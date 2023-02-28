const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const app = require("./app");
const connectToDB = require("./utils/db.js");

const port = process.env.PORT || 8008;
connectToDB();
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
