import express from "express";
import { getCars } from "../Controller/cars.controller.js";

const userRouter = express.Router();

userRouter.get("/", getCars);

export default userRouter;