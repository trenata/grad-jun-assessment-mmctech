import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

export const dbConnection = async () => {
    try {
        const con = await mongoose.connect(MONGODB_URL, { dbName: MONGODB_DB_NAME });
        console.log(`mongodb connected: ${con.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

export default dbConnection;