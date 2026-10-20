import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import vaultRoutes from "./routes/vault.routes.js"


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin:process.env.CORS_ORIGIN , credentials: true}))
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/vault", vaultRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log("🦻 Server is listening on port: ", PORT)
})
