const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");
// const dotenv = require('dotenv');

const connectDB = async (uri) => {
  try {
    const connectionInstance = await mongoose.connect(
      `${uri}/${DB_NAME}`
    );
    console.log(
      `\n Mongo Connected !! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
