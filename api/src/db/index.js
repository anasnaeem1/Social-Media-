import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import dotenv from 'dotenv';


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

export default connectDB