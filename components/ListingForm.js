"use client";
import React, { useState } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createListing } from "@/lib/action";
import { z } from "zod";
import LocationInput from "@/components/LocationInput";
import { useRouter } from "next/navigation";
import PricePrediction from "@/components/PricePrediction";

const ListingForm = () => {
    const [errors, setErrors] = useState({})
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [category, setCategory] = useState("");
    const [customBhk, setCustomBhk] = useState(false);
    const [location, setLocation] = useState(null);
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        sqft: '',
        bhk: '',
        bedrooms: '',
        bathrooms: '',
        furnishing: '',
    });

    const handleFormSubmit = async (prevState, formData) => {
        try {
            // First, upload all images to Sanity
            const imageAssets = await Promise.all(
                selectedImages.map(async (file) => {
                    const imageData = new FormData();
                    imageData.append('file', file);
                    
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: imageData
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to upload image');
                    }
                    
                    const data = await response.json();
                    return {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: data.assetId
                        }
                    };
                })
            );

            // Prepare form values with the uploaded images
            const formValues = {
                title: formData.get("title"),
                description: formData.get("description"),
                category: formData.get("category"),
                bhk: formData.get("bhk"),
                sqft: formData.get("sqft"),
                furnishing: formData.get("furnishing"),
                configuration: {
                    bedrooms: formData.get("bedrooms"),
                    bathrooms: formData.get("bathrooms"),
                    balconies: formData.get("balconies"),
                    parking: formData.get("parking")
                },
                price: formData.get("price"),
                image: imageAssets,  // Use the uploaded image assets
                location: location
            };

            if (formData.get("category") === "rent") {
                formValues.deposit = formData.get("deposit");
            }

            // TODO: Add validation
            // await formValidation.parseAsync(formValues);

            const result = await createListing(prevState, formData, formValues)
            // console.log(result);

            if (result?.status === 'SUCCESS') {
                // console.log(result);
                
                toast({
                    title: "SUCCESS",
                    description: "Your Listing Has Been Created.",
                });
                router.push(`/listing/${result._id}`);
                router.refresh();
            }
            return result;
            
        } catch (error) {
            console.error("Form submission error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create listing",
                variant: "destructive"
            });
            return { ...prevState, error: error.message, status: "ERROR" };
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: '',
        status: "INITIAL"
    })

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length < 2) {
            setImageError("Please select at least 2 images");
            return;
        }
        
        if (files.length > 10) {
            setImageError("Maximum 10 images allowed");
            return;
        }

        setImageError("");
        setSelectedImages(files);
    };

    const handleFormValueChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">
                    Title
                </label>
                <Input 
                    id="title" 
                    name="title" 
                    className="startup-form_input" 
                    required 
                    placeholder="Startup Title"
                /> 

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Description
                </label>
                <Textarea 
                    id="description" 
                    name="description" 
                    className="startup-form_textarea" 
                    required 
                    placeholder="Startup Description"
                /> 

                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Category
                </label>
                <Select 
                    name="category" 
                    required 
                    defaultValue="" 
                    onValueChange={(value) => setCategory(value)}
                >
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="plot">Plots/Land</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="location" className="startup-form_label">
                    Location
                </label>
                <LocationInput 
                    value={location}
                    onChange={(locationDetails) => {
                        setLocation(locationDetails);
                    }}
                />
                {errors.location && <p className="startup-form_error">{errors.location}</p>}
            </div>

            {category === "rent" && (
                <div>
                    <label htmlFor="deposit" className="startup-form_label">
                        Security Deposit (₹)
                    </label>
                    <Input 
                        id="deposit" 
                        name="deposit" 
                        type="number"
                        className="startup-form_input" 
                        required 
                        placeholder="Enter security deposit amount"
                    /> 
                    {errors.deposit && <p className="startup-form_error">{errors.deposit}</p>}
                </div>
            )}

            <div>
                <label htmlFor="bhk" className="startup-form_label">
                    BHK
                </label>
                <Select 
                    name="bhk" 
                    required 
                    defaultValue="" 
                    onValueChange={(value) => {
                        if (value === "other") {
                            setCustomBhk(true);
                        } else {
                            setCustomBhk(false);
                            handleFormValueChange('bhk', value);
                        }
                    }}
                >
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="1.5">1.5 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="2.5">2.5 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="3.5">3.5 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>

                {customBhk && (
                    <div className="mt-2">
                        <Input 
                            id="custom_bhk" 
                            name="bhk" 
                            type="number"
                            step="0.5"
                            min="0.5"
                            className="startup-form_input" 
                            required 
                            placeholder="Enter custom BHK value"
                        /> 
                    </div>
                )}

                {errors.bhk && <p className="startup-form_error">{errors.bhk}</p>}
            </div>

            <div>
                <label htmlFor="sqft" className="startup-form_label">
                    Area (sq.ft)
                </label>
                <Input 
                    id="sqft" 
                    name="sqft" 
                    type="number"
                    className="startup-form_input" 
                    required 
                    placeholder="Enter carpet area in sq.ft"
                    onChange={(e) => handleFormValueChange('sqft', e.target.value)}
                /> 
                {errors.sqft && <p className="startup-form_error">{errors.sqft}</p>}
            </div>

            <div>
                <label htmlFor="furnishing" className="startup-form_label">
                    Furnishing Status
                </label>
                <Select 
                    name="furnishing" 
                    required 
                    defaultValue=""
                    onValueChange={(value) => handleFormValueChange('furnishing', value)}
                >
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select furnishing status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="full">Fully Furnished</SelectItem>
                        <SelectItem value="semi">Semi Furnished</SelectItem>
                        <SelectItem value="none">Unfurnished</SelectItem>
                    </SelectContent>
                </Select>
                {errors.furnishing && <p className="startup-form_error">{errors.furnishing}</p>}
            </div>

            <div>
                <label className="startup-form_label">Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="bedrooms" className="startup-form_label !text-[15px] !text-gray-600">Bedrooms</label>
                        <Input 
                            id="bedrooms" 
                            name="bedrooms" 
                            type="number"
                            min="1"
                            className="startup-form_input" 
                            required 
                            onChange={(e) => handleFormValueChange('bedrooms', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="bathrooms" className="startup-form_label !text-[15px] !text-gray-600">Bathrooms</label>
                        <Input 
                            id="bathrooms" 
                            name="bathrooms" 
                            type="number"
                            min="1"
                            className="startup-form_input" 
                            required 
                            onChange={(e) => handleFormValueChange('bathrooms', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="balconies" className="startup-form_label !text-[15px] !text-gray-600">Balconies</label>
                        <Input 
                            id="balconies" 
                            name="balconies" 
                            type="number"
                            min="0"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="parking" className="startup-form_label !text-[15px] !text-gray-600">Parking Spots</label>
                        <Input 
                            id="parking" 
                            name="parking" 
                            type="number"
                            min="0"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                </div>
                {errors.configuration && <p className="startup-form_error">{errors.configuration}</p>}
            </div>

            <div>
                <label htmlFor="price" className="startup-form_label">
                    {category === "rent" ? "Monthly Rent (₹)" : "Price (₹)"}
                </label>
                <div className="flex gap-2">
                    <Input 
                        id="price" 
                        name="price" 
                        type="number"
                        className="startup-form_input" 
                        required 
                        placeholder={category === "rent" ? "Enter monthly rent" : "Enter property price"}
                    /> 
                    <PricePrediction 
                        category={category} 
                        formValues={formValues}
                        location={location}
                    />
                </div>
                {errors.price && <p className="startup-form_error">{errors.price}</p>}
            </div>

            <div>
                <label htmlFor="images" className="startup-form_label">
                    Property Images
                </label>
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <Input 
                            id="images" 
                            name="images" 
                            type="file"
                            multiple
                            accept="image/*"
                            className="startup-form_input hidden" 
                            required 
                            onChange={handleImageChange}
                        />
                        <Button 
                            type="button"
                            onClick={() => document.getElementById('images').click()}
                            className="startup-form_input flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <Upload className="h-5 w-5" />
                            Choose Images
                        </Button>
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {selectedImages.map((file, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 p-0"
                                        onClick={() => {
                                            const newImages = selectedImages.filter((_, i) => i !== index);
                                            setSelectedImages(newImages);
                                            if (newImages.length < 2) {
                                                setImageError("Please select at least 2 images");
                                            }
                                        }}
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {imageError && (
                        <p className="startup-form_error">{imageError}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                        Select 2-10 images of your property. First image will be the cover image.
                    </p>
                </div>

                {errors.images && <p className="startup-form_error">{errors.images}</p>}
            </div>

            <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
                {isPending ? "Submiting..." : "Submit"}
                <Send className="size-6 ml-2"/>
            </Button>
                
            </form>
        </>
    )
}

export default ListingForm;