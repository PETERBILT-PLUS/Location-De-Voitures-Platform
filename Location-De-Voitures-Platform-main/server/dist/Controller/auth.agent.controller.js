"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSession = exports.loginAgent = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("stripe"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { nom, prenom, email, password, tel: phoneNumber, adress: address, city, website, numeroDinscription: registrationNumber, numeroDeLicenceCommerciale: businessLicenseNumber, numeroDePoliceDassurance: insurancePolicyNumber } = req.body;
        console.log(nom, prenom, email, password, phoneNumber, address, city, website, registrationNumber, businessLicenseNumber, insurancePolicyNumber);
        if (!nom || !prenom || !email || !password || !phoneNumber || !address || !city || !registrationNumber || !businessLicenseNumber || !insurancePolicyNumber) {
            return res.status(403).json({ success: false, message: "Missing Credentials" });
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create user object
        const newAgent = new agency_modal_js_1.default({
            nom, prenom, email, password: hashedPassword, phoneNumber, address, city, website,
            registrationNumber, businessLicenseNumber, insurancePolicyNumber
        });
        // Save user to database
        yield newAgent.save();
        // Return success response
        res.status(201).json({ success: true, message: "User registered successfully" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.registerUser = registerUser;
const loginAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        // Find the user by email
        const user = yield agency_modal_js_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }
        // Compare passwords
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "90d" });
        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: false });
        res.status(200).json({ success: true, message: "User Succesfully login" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loginAgent = loginAgent;
const createPaymentSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
        if (!CLIENT_DOMAIN || !STRIPE_KEY || !SERVER_DOMAIN) {
            throw new Error("Environment variables not available");
        }
        const stripe = new stripe_1.default(STRIPE_KEY);
        // Extract the user ID from the request (assuming the user is authenticated)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming you have a middleware to extract the user ID from the request
        // Find the user by their ID
        const user = yield agency_modal_js_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Add 30 days to the current date for subscription expiration
        const currentDate = new Date();
        const subscriptionExpirationAt = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        // Update the user's subscription expiration property
        user.subscriptionExpiresAt = subscriptionExpirationAt;
        yield user.save();
        // Create a payment session with Stripe
        const session = yield stripe.checkout.sessions.create({
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createPaymentSession = createPaymentSession;
