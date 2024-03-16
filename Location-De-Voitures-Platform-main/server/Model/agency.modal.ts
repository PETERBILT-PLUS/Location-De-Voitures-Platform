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
    password: string; // Add password field
    phoneNumber: string;
    address: string;
    city: string;
    website?: string;
    agenceLocalisation?: IAgenceLocalisation | null;
    registrationNumber: string;
    businessLicenseNumber: string;
    insurancePolicyNumber: string;
    subscriptionExpiresAt: Date;
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
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    website: { type: String, required: false },
    agenceLocalisation: { type: AgenceLocalisationSchema, default: null },
    registrationNumber: { type: String, required: true },
    businessLicenseNumber: { type: String, required: true },
    insurancePolicyNumber: { type: String, required: true },
    subscriptionExpiresAt: { type: Date, default: Date.now() }
}, { timestamps: true });

export default mongoose.model<IAgency>("Agency", AgencySchema);