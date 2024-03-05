import mongoose, { Document } from "mongoose";

interface User extends Document {
    nom: string;
    prenom: string;
    username: string;
    email: string;
    sexe: 'male' | 'female';
    password: string;
    cars?: string[]; // Array of car IDs
}

const UserShema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    sexe: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    password: {
        type: String,
        required: true,
    },
    cars: {
        type: Array,
    }
}, {
    timestamps: true,
});

export default mongoose.model<User>("User", UserShema);