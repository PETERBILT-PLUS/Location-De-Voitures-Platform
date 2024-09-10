import { Request, Response } from 'express';
import Vehicle, { IVehicle } from '../Model/vehicule.model.js';
import Agency from '../Model/agency.modal.js';

export const getCars = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit: number = 20; // Number of vehicles per page
        const cursor: string | undefined = req.query.cursor?.toString(); // Cursor received from client

        // Construct query for cursor-based pagination
        let query: any = cursor ? { _id: { $gt: cursor } } : {};

        // Aggregate query
        const vehicles: IVehicle[] = await Vehicle.aggregate([
            { $match: query }, // Match vehicles based on cursor
            {
                $lookup: {
                    from: Agency.collection.name,
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
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
