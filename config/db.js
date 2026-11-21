//config
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB nyambung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[eror] gagal konek: ${error.message}`);
    process.exit(1); //matiin server
  }
};

export default connectDB;
