const mongoose = require("mongoose");

const connectDB = async (dburl) => {
  try {
    await mongoose.connect(dburl);
  } catch (error) {
    console.log("Unable to connect to DB!");
  }
};

module.exports = connectDB;
