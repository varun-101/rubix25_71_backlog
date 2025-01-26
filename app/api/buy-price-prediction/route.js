import { predictPrice } from './buy_model';
import { readFileSync } from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { locality, region, area, address } = await req.json();
        console.log("locality", locality);
        console.log("region", region);
        console.log("area", area);
        console.log("address", address);

        // Validate required fields
        if (!locality || !region || !area || !address) {
            return Response.json({ 
                success: false, 
                message: "Missing required fields",
                details: {
                    locality: !locality ? "Locality is required" : null,
                    region: !region ? "Region is required" : null,
                    area: !area ? "Area is required" : null,
                    address: !address ? "Address is required" : null
                }
            }, { status: 400 });
        }

        // Read the property data file from the correct directory
        const dataPath = path.join(process.cwd(), 'app', 'api', 'buy-price-prediction', 'output_15MB.json');
        const propertyData = JSON.parse(readFileSync(dataPath, 'utf8'));

        // Get price prediction
        const predictedPrice = predictPrice({ locality, region, area, address }, propertyData);
        console.log("predictedPrice", predictedPrice);
        if (!predictedPrice) {
            return Response.json({ 
                success: false, 
                message: "Could not predict price for the given location" 
            }, { status: 404 });
        }

        return Response.json({ 
            success: true,
            predictedPrice,
            message: "Price prediction successful"
        });

    } catch (error) {
        console.error('Price prediction error:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to predict price",
            error: error.message 
        }, { status: 500 });
    }
}
