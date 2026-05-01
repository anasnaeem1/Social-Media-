const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async (uri = process.env.MONGO_URI) => {
  if (!uri) {
    console.log("MONGODB connection error", new Error("MONGO_URI is not defined"));
    process.exit(1);
  }

  try {
    const connectionInstance = await mongoose.connect(uri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `\n Mongo Connected !! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
