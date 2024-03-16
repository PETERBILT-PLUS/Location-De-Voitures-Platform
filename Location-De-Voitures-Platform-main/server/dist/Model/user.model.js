"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vehicule_model_js_1 = require("./vehicule.model.js");
const UserShema = new mongoose_1.default.Schema({
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
    profilePicture: {
        type: String,
        required: true,
        default: "",
    },
    cars: {
        type: [vehicule_model_js_1.VehicleSchema],
        required: false,
        default: [],
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", UserShema);
