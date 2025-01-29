import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DBName } from "../constant.js";


const connectDB = async ()=>{
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DBName}`)
    console.log(`MongoDB connected : ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error : ${error.message}`)
    process.exit(1)
  }
};

export default connectDB