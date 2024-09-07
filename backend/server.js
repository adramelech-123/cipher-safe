import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json())

app.use("/", (req, res) => {
    res.json("Hello CipherSafe")
});

app.listen(PORT, () => {
    connectDB()
    console.log("🦻 Server is listening on port: ", PORT)
})
