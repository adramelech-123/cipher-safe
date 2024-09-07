import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const cxn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${cxn.connection.host} 👍`);
  } catch (error) {
    console.log("Error connecting to cipher-safe database! 👎", error.message);
    process.exit(1); 
  }
}; 
