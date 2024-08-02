import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const url = process.env.DB_URL;
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(url);
    if (conn) {
      console.log(`MongoDB Connected`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default dbConnect;
