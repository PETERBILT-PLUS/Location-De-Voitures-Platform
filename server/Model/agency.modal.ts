import mongoose, { Document } from "mongoose";

// Interface for agency location
interface IAgenceLocalisation {
    latitude: number;
    longitude: number;
}

// Interface for agency document
interface IAgency extends Document {
    nom: string;
    prenom: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    website?: string;
    agenceLocalisation?: IAgenceLocalisation;
    // Additional details specific to the agency
    registrationNumber: string; // Registration number of the agency
    businessLicenseNumber: string; // Business license number
    insurancePolicyNumber: string; // Insurance policy number
    // You can add more fields as per your requirements
}

// Schema for agency location
const AgenceLocalisationSchema = new mongoose.Schema({
    latitude: { type: Number },
    longitude: { type: Number }
});

// Schema for Agency
const AgencySchema = new mongoose.Schema<IAgency>({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    website: { type: String },
    agenceLocalisation: { type: AgenceLocalisationSchema },
    registrationNumber: { type: String, required: true },
    businessLicenseNumber: { type: String, required: true },
    insurancePolicyNumber: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IAgency>("Agency", AgencySchema);