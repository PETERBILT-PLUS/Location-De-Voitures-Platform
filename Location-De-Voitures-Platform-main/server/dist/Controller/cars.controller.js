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
exports.getCars = void 0;
const vehicule_model_js_1 = __importDefault(require("../Model/vehicule.model.js"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = 20; // Number of vehicles per page
        const cursor = (_a = req.query.cursor) === null || _a === void 0 ? void 0 : _a.toString(); // Cursor received from client
        // Construct query for cursor-based pagination
        let query = cursor ? { _id: { $gt: cursor } } : {};
        // Aggregate query
        const vehicles = yield vehicule_model_js_1.default.aggregate([
            { $match: query }, // Match vehicles based on cursor
            {
                $lookup: {
                    from: agency_modal_js_1.default.collection.name,
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'Agency'
                }
            },
            { $unwind: '$Agency' }, // Unwind the Agency array
            {
                $match: {
                    'Agency.subscriptionExpiresAt': { $gt: new Date() } // Filter based on subscription expiry
                }
            },
            { $sort: { _id: 1 } }, // Sort by _id to ensure consistent ordering
            { $limit: limit } // Limit the number of vehicles
        ]);
        // Determine the next cursor        
        const nextCursor = vehicles.length > 0 ? vehicles[vehicles.length - 1]._id.toString() : undefined;
        // Send response
        res.status(200).json({ vehicles, nextCursor });
    }
    catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCars = getCars;
