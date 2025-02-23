import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        // console.log("Connection successful");
    } catch (error) {
        console.log("Failed to connect DB", error);
    }
}

export default connectToDB; 