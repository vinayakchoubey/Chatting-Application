import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        try {
            await mongoose.connection.collection("users").dropIndex("email_1");
            console.log("Dropped email_1 index");
        } catch (e) {
            console.log("Index email_1 might not exist or verify name:", e.message);
        }
        
        try {
            await mongoose.connection.collection("users").dropIndex("phoneNumber_1");
            console.log("Dropped phoneNumber_1 index");
        } catch (e) {
            console.log("Index phoneNumber_1 might not exist", e.message);
        }

        process.exit(0);
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
};

connectDB();
