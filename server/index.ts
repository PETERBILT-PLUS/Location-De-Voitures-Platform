import express, { Express } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./Routes/auth.router.js";
import { config } from "dotenv";
import { connectToDatabase } from "./db/connectToDatabase.js";
config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`server is running on port ${PORT}`);
});