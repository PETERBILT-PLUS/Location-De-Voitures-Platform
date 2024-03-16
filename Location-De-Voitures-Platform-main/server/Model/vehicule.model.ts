import mongoose, { Document, Schema } from 'mongoose';

interface IVehicle extends Document {
    carName: string;
    carFuel: string;
    carMarque: string;
    carPhotos: string[]; // Array of file paths or URLs
    places: string;
    carType: string;
    carKm: number;
    pricePerDay: number;
    isAvailable: boolean;
    ownerId: Schema.Types.ObjectId; // Reference to the owner (agency)
    maintenanceRecords: MaintenanceRecord[];
    registration: RegistrationDocument;
    insurance: InsuranceDocument;
}

interface MaintenanceRecord {
    date: Date;
    description: string;
}

interface RegistrationDocument {
    registrationNumber: string;
    registrationDate: Date;
    registrationExpiration: Date;
    vehicleIdentificationNumber: string;
    // Add more fields as necessary
}

interface InsuranceDocument {
    insuranceCompany: string;
    policyNumber: string;
    expirationDate: Date;
    // Add more fields as necessary
}

const MaintenanceRecordSchema = new Schema<MaintenanceRecord>({
    date: { type: Date, required: true },
    description: { type: String, required: true }
});

const RegistrationDocumentSchema = new Schema<RegistrationDocument>({
    registrationNumber: { type: String, required: true },
    registrationDate: { type: Date, required: true },
    registrationExpiration: { type: Date, required: true },
    vehicleIdentificationNumber: { type: String, required: true }
});

const InsuranceDocumentSchema = new Schema<InsuranceDocument>({
    insuranceCompany: { type: String, required: true },
    policyNumber: { type: String, required: true },
    expirationDate: { type: Date, required: true }
});

export const VehicleSchema = new Schema<IVehicle>({
    carName: { type: String, required: true },
    carFuel: { type: String, required: true },
    carMarque: { type: String, required: true },
    carPhotos: [{ type: String, required: true }],
    places: { type: String, required: true },
    carType: { type: String, required: true },
    carKm: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }, // Indicates if the vehicle is available for rent
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maintenanceRecords: [MaintenanceRecordSchema],
    registration: { type: RegistrationDocumentSchema, required: true },
    insurance: { type: InsuranceDocumentSchema, required: true }
}, { timestamps: true });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);