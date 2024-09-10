import { Request, Response } from "express";
import Vehicule, { IVehicle } from "../Model/vehicule.model.js";


export const createListing = async (req: Request, res: Response) => {
    try {
        const agent_id = req.agent?._id;
        const { carEtat, carFuel, carKm, carMarque, carName, carPhotos, carType, insurance, places, pricePerDay, registration } = req.body;
        const { expirationDate, insuranceCompany, policyNumber } = insurance;
        const { registrationDate, registrationExpiration, registrationNumber, vehicleIdentificationNumber } = registration;
        if (!carEtat || !carFuel || !carKm || !carMarque || !carName || !carPhotos || !carType || !insurance || !places || !pricePerDay || !registration || !expirationDate || !insuranceCompany || !policyNumber || !registrationDate || !registrationExpiration || !registrationNumber || !vehicleIdentificationNumber) {
            return res.status(401).json({ success: false, message: "Missing Credantials" });
        }
        const vehicule: IVehicle = new Vehicule({
            carEtat,
            carFuel,
            carKm,
            carMarque,
            carName,
            carPhotos,
            carType,
            insurance,
            places,
            pricePerDay,
            registration,
            ownerId: agent_id,
        });

        vehicule.save().then(() => {
            res.status(201).json({ success: true, message: "Vehicule Saved Succesfully" });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}