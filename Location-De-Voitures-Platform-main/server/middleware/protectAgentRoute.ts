import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Agent from "../Model/agency.modal.js";

// Extend the Request object to include a user property
declare global {
    namespace Express {
        interface Request {
            agent?: any; // Adjust the type according to your user schema
        }
    }
}

// Middleware to protect routes
export const protectAgentRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        console.log(token);
        
        // Check if token is provided
        
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized: Token not provided" });
        
        // Retrieve JWT_SECRET from environment variables
        const JWT_SECRET = process.env.JWT_SECRET;
        // Check if JWT_SECRET is available
        if (!JWT_SECRET) throw new Error("The JWT_SECRET in the protect route is not available please check the .env file");
        
        // Verify token validity and decode payload
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        // Check if token is valid
        if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
        
        // Find user by decoded user id and exclude password field
        const agent = await Agent.findById(decoded.userId).select("-password");
        // Check if user exists
        if (!agent) return res.status(200).json({ success: false, message: "User Not Found" });
        
        // Assign user object to the request
        req.agent = agent;
        // Continue to the next middleware
        next();
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}