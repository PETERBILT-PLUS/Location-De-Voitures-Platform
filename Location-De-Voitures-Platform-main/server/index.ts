import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/auth.router.js";
import agentRouter from "./Routes/auth.agent.router.js";
import { config } from "dotenv";
import { connectToDatabase } from "./db/connectToDatabase.js";
config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Set this to your frontend's domain
    methods: ["GET", "POST"],
    credentials: true,
  }));

app.use("/auth", authRouter);
app.use("/agent", agentRouter);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`server is running on port ${PORT}`);
});