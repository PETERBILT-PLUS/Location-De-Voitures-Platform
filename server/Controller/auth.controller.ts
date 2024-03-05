import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserShema from "../Model/user.model.js";


// this function take the credantials and enter it in the database
export const register = async (req: Request, res: Response) => {
    try {
        const { nom, prenom, username, email, sexe, password } = req.body;

        // Check if all the credentials are provided
        if (!nom || !prenom || !username || !email || !sexe || !password) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        // Check if this user is already in the database
        const findUser = await UserShema.findOne({ email: email });
        if (findUser) {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

            // Generate JWT token
            const token = jwt.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });

            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

            // Send a token in a cookie
            return res.status(200).json({ success: true, message: "User Already Registered" }).cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
            });
        }

        // Generate the bcrypt salt and the hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create a new user and save it in the database
        const newUser = new UserShema({ nom, prenom, username, sexe, password: hashedPass });
        await newUser.save().then(() => {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

            // Generate JWT token for the new user
            const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "60d" });

            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

            // Send a token in a cookie
            res.status(200).json({ success: true, message: "User Created" }).cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
            });
        }).catch((error) => {
            throw new Error(error);
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

// this function check if the user exist using the credantials after it gives the cookie
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // check if email and password is available
        if (!email || !password) return res.status(400).json({ success: false, message: "Missing Credantials" });
        const findUser = await UserShema.findOne({ email: email });
        if (!findUser) return res.status(404).json({ success: false, message: "Some of the information or all the informatins provided is incorrect. Please check and try again." });
        const passwordIsMatch = await bcrypt.compare(password, findUser.password);
        if (!passwordIsMatch) return res.status(404).json({ success: false, message: "Some of the information or all the informatins provided is incorrect. Please check and try again." });
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

        // Generate JWT token for the new user
        const token = jwt.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });

        const DEPLOYMENT = process.env.DEPLOYMENT;
        // Check if DEPLOYMENT is available or not
        if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

        // Send a token in a cookie
        res.status(200).json({ success: true, message: "User Sign In Succesful" }).cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
            secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}