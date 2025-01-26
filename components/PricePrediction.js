"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const PricePrediction = ({ category, formValues, location }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(location);

    // Don't show the button for plot category
    if (category === "plot") {
        return null;
    }

    const getFurnishingNumber = (status) => {
        switch (status) {
            case 'full': return 2;
            case 'semi': return 1;
            case 'none': return 0;
            default: return 1;
        }
    };

    const getPrediction = async () => {
        try {
            setLoading(true);

            // Validate required fields
            if (!formValues.sqft || !formValues.bhk || !formValues.bathrooms || !location?.city) {
                toast({
                    title: "Missing Information",
                    description: "Please fill in all required fields first (area, BHK, bathrooms, and location)",
                    variant: "destructive"
                });
                return;
            }

            let endpoint;
            let payload;

            if (category === "rent") {
                console.log(process.env.NEXT_PUBLIC_RENT_MODEL_API_URL);
                endpoint = process.env.NEXT_PUBLIC_RENT_MODEL_API_URL || 'http://localhost:5000/predict';
                payload = {
                    area: Number(formValues.sqft),
                    bhk: Number(formValues.bhk),
                    bathrooms: Number(formValues.bathrooms),
                    furnishing: getFurnishingNumber(formValues.furnishing),
                    city: location?.city || "",
                    address: location?.formatted || "",
                    beds: Number(formValues.bedrooms)
                };
            } else if (category === "buy") {
                endpoint = '/api/buy-price-prediction';
                payload = {
                    locality: location?.district || "",
                    region: location?.city || "",
                    area: Number(formValues.sqft),
                    address: location?.formatted || ""
                };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to get prediction');
            }

            const data = await response.json();
            setPrediction(data);
            
            const priceText = category === "rent" ? data.predicted_rent : data.predictedPrice;
            
            toast({
                title: "Prediction Ready",
                description: `Recommended ${category === "rent" ? "rent" : "price"}: ₹${Math.round(priceText).toLocaleString('en-IN')}`,
            });

        } catch (error) {
            console.error('Prediction error:', error);
            toast({
                title: "Error",
                description: "Failed to get price prediction. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="flex-shrink-0 mt-6"
                    onClick={(e) => {
                        e.preventDefault();
                        getPrediction();
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner className="h-4 w-4" />
                    ) : (
                        <Calculator className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>
            
            {prediction && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Price Prediction</DialogTitle>
                        <DialogDescription>
                            Based on your property details:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Recommended {category === "rent" ? "Rent" : "Price"}</p>
                                <p className="text-lg font-semibold">
                                    ₹{Math.round(category === "rent" ? prediction.predicted_rent : prediction.predictedPrice).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Rate per sq.ft</p>
                                <p className="text-lg font-semibold">
                                    ₹{Math.round(category === "rent" ? prediction.area_rate : (prediction.predictedPrice / formValues.sqft)).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            This is an AI-powered prediction based on similar properties in your area.
                            Actual market prices may vary.
                        </p>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default PricePrediction;