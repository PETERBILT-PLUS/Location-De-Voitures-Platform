import express from "express";
import { createListing } from "../Controller/cars.cotroller.js";

const carsRouter = express.Router();

carsRouter.post("/create-listing", createListing);

export default carsRouter;