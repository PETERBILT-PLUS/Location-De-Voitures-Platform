import { Request, Response } from "express";

export const createListing = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}