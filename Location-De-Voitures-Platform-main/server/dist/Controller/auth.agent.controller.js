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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webHooks = exports.createPaymentSession = exports.loginAgent = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("stripe"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { nom, prenom, email, password, tel: phoneNumber, adress: address, city, website, numeroDinscription: registrationNumber, numeroDeLicenceCommerciale: businessLicenseNumber, numeroDePoliceDassurance: insurancePolicyNumber } = req.body;
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
        const { email, password: userPass } = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !userPass) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        // Find the user by email
        const user = yield agency_modal_js_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }
        // Compare passwords
        const isPasswordValid = yield bcrypt_1.default.compare(userPass, user.password);
        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "90d" });
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: false, sameSite: "strict" });
        res.status(200).json({ success: true, message: "User Succesfully login", user: rest });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loginAgent = loginAgent;
const createPaymentSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const agentId = (_b = req.agent) === null || _b === void 0 ? void 0 : _b._id;
        const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
        if (!CLIENT_DOMAIN || !STRIPE_KEY || !SERVER_DOMAIN) {
            throw new Error("Environment variables not available");
        }
        const stripe = new stripe_1.default(STRIPE_KEY);
        // Extract the user ID from the request (assuming the user is authenticated)
        // Create a payment session with Stripe
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                    price_data: {
                        currency: "MAD",
                        product_data: {
                            name: "plateforme de paiement mensuel",
                            // You can add additional product details here
                        },
                        unit_amount: 9900, // Amount in cents (99 MAD)
                    },
                    quantity: 1,
                }],
            mode: "payment", // Switch to payment mode for one-time payment
            success_url: `${CLIENT_DOMAIN}/payment-success`,
            cancel_url: `${CLIENT_DOMAIN}/payment-failed`,
            // You can add more options as needed, such as customer details
        });
        // Return the session URL to the client
        res.send({ url: session.url });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createPaymentSession = createPaymentSession;
const webHooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    let signInSecretKey = "whsec_35b71eab6458bcfd58570b9afda912b04c9bd7b7d6f9bf5a2cfeeac5470ee945";
    const payload = req.body;
    const sig = req.headers["stripe-signature"];
    const STRIPE_KEY = process.env.STRIPE_KEY;
    if (!STRIPE_KEY)
        throw new Error("the STRIPE_KEY is not available please check the .env file");
    let event;
    try {
        const stripe = new stripe_1.default(STRIPE_KEY);
        if (sig) {
            event = stripe.webhooks.constructEvent(payload, sig, signInSecretKey);
            if (event.type === "checkout.session.completed") {
                const agentId = (_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.data) === null || _c === void 0 ? void 0 : _c.object) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.agentId;
                const currentDate = new Date();
                // Update the user's subscription expiration property
                const agent = yield agency_modal_js_1.default.findByIdAndUpdate(agentId, {
                    // Add 30 days to the current date for subscription expiration
                    subscriptionExpiresAt: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 30),
                }, {
                    new: true,
                });
                if (!agent) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                res.status(201).json({ success: true, message: "Payment And Subscription Succesful" });
            }
        }
        else {
            throw new Error("the sig variable is not available please check the agent auth controller");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Internal Server Error" });
        return false;
    }
});
exports.webHooks = webHooks;
