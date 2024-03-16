import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import agencyModal from "../Model/agency.modal.js";


export const registerUser = async (req: Request, res: Response) => {
    try {
        // Input validation
        const {
            nom, prenom, email, password, tel: phoneNumber, adress: address, city, website, numeroDinscription: registrationNumber,
            numeroDeLicenceCommerciale: businessLicenseNumber, numeroDePoliceDassurance: insurancePolicyNumber
        } = req.body;
        console.log(nom, prenom, email, password, phoneNumber, address, city, website, registrationNumber, businessLicenseNumber, insurancePolicyNumber);


        if (!nom || !prenom || !email || !password || !phoneNumber || !address || !city || !registrationNumber || !businessLicenseNumber || !insurancePolicyNumber) {
            return res.status(403).json({ success: false, message: "Missing Credentials" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newAgent = new agencyModal({
            nom, prenom, email, password: hashedPassword, phoneNumber, address, city, website,
            registrationNumber, businessLicenseNumber, insurancePolicyNumber
        });

        // Save user to database
        await newAgent.save();

        // Return success response
        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const loginAgent = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find the user by email
        const user = await agencyModal.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "90d" });

        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: false });
        res.status(200).json({ success: true, message: "User Succesfully login" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const createPaymentSession = async (req: Request, res: Response) => {
    try {
        const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
        if (!CLIENT_DOMAIN || !STRIPE_KEY || !SERVER_DOMAIN) {
            throw new Error("Environment variables not available");
        }

        const stripe = new Stripe(STRIPE_KEY);
        // Extract the user ID from the request (assuming the user is authenticated)
        const userId = req.user?._id; // Assuming you have a middleware to extract the user ID from the request

        // Find the user by their ID
        const user = await agencyModal.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add 30 days to the current date for subscription expiration
        const currentDate = new Date();
        const subscriptionExpirationAt = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Update the user's subscription expiration property
        user.subscriptionExpiresAt = subscriptionExpirationAt;
        await user.save();

        // Create a payment session with Stripe
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'mad', // Moroccan Dirham
                    product_data: {
                        name: 'Agent Registration Fee',
                    },
                    unit_amount: 9900, // Amount in Moroccan Dirham (99 MAD)
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${CLIENT_DOMAIN}/registration-success`,
            cancel_url: `${CLIENT_DOMAIN}/agent-registerg`,
        });

        // Return the session ID to the client
        res.send({ url: session.url });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}