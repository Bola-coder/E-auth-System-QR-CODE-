const mongoose = require("mongoose");

const connectToDB = () => {
  const db = process.env.DATABASE_URI;
  mongoose
    .connect(db)
    .then((con) => {
      console.log("DB Conencted successfully");
    })
    .catch((err) => {
      console.log(`An error occured during db conenction ${err}`);
    });
};

module.exports = connectToDB;
