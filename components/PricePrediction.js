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
    // console.log(location);
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

            const payload = {
                area: Number(formValues.sqft),
                bhk: Number(formValues.bhk),
                bathrooms: Number(formValues.bathrooms),
                furnishing: getFurnishingNumber(formValues.furnishing),
                city: location?.city || "",
                address: location?.formatted || "",
                beds: Number(formValues.bedrooms)
            };
            console.log(location.formatted);
            
            console.log(payload);

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to get prediction');
            }

            const data = await response.json();
            setPrediction(data);
            
            toast({
                title: "Prediction Ready",
                description: `Recommended ${category === "rent" ? "rent" : "price"}: ₹${Math.round(data.predicted_rent).toLocaleString('en-IN')}`,
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
                                <p className="text-sm text-gray-500">Recommended Price</p>
                                <p className="text-lg font-semibold">
                                    ₹{Math.round(prediction.predicted_rent).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Rate per sq.ft</p>
                                <p className="text-lg font-semibold">
                                    ₹{Math.round(prediction.area_rate).toLocaleString('en-IN')}
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