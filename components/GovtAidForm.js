'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { updateUserGovtAidInfo } from "@/lib/actions";

const GovtAidForm = ({ user }) => {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [eligibleSchemes, setEligibleSchemes] = useState([]);
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        annualIncome: '',
        ownsHouse: false,
        category: '',
        disability: false,
        currentHousingType: '',
        location: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                annualIncome: user.annualIncome || '',
                ownsHouse: user.ownsHouse || false,
                category: user.category || '',
                disability: user.disability || false,
                currentHousingType: user.currentHousingType || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const result = await updateUserGovtAidInfo(user._id, formData);
                toast({
                    title: result.success ? "Changes saved" : "Error",
                    description: result.message,
                    className: "bg-white border border-gray-200",
                    variant: result.success ? "default" : "destructive",
                });
                if (result.success) {
                    setIsEditing(false);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to save changes",
                    variant: "destructive",
                    className: "bg-white border border-gray-200",
                });
            }
        });
    }, [formData, user._id, toast]);

    const getIncomeCategory = useCallback((income) => {
        if (income <= 300000) return 'EWS';
        if (income <= 600000) return 'LIG';
        if (income <= 1200000) return 'MIG-I';
        if (income <= 1800000) return 'MIG-II';
        return null;
    }, []);

    const checkEligibility = useCallback(() => {
        const schemes = [];

        if (formData.annualIncome <= 300000 && 
            !formData.ownsHouse && 
            formData.location === 'rural') {
            schemes.push({
                name: 'Pradhan Mantri Gramin Awas Yojana (PMGAY)',
                priority: formData.category !== 'general' || formData.disability || formData.currentHousingType === 'kutcha'
            });
        }

        if (!formData.ownsHouse && formData.annualIncome <= 1800000) {
            schemes.push({
                name: 'Pradhan Mantri Awas Yojana (PMAY)',
                category: getIncomeCategory(formData.annualIncome)
            });
        }

        setEligibleSchemes(schemes);
        
        toast({
            title: "Eligibility Check Complete",
            description: schemes.length > 0 
                ? `You may be eligible for ${schemes.length} scheme(s)` 
                : "No eligible schemes found based on current criteria",
            className: "bg-white border border-gray-200",
        });
    }, [formData, getIncomeCategory, toast]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const hasSavedInfo = user.annualIncome || user.category || user.currentHousingType || user.location;
    // console.log("user", user);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-30-bold mb-6">Government Housing Aid Information</h2>
                {hasSavedInfo && !isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Information
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                    {hasSavedInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {user.annualIncome && (
                                <div>
                                    <span className="text-gray-600">Annual Income:</span>
                                    <span className="ml-2 font-medium">₹{user.annualIncome.toLocaleString()}</span>
                                </div>
                            )}
                            {user.category && (
                                <div>
                                    <span className="text-gray-600">Social Category:</span>
                                    <span className="ml-2 font-medium capitalize">{user.category}</span>
                                </div>
                            )}
                            {user.currentHousingType && (
                                <div>
                                    <span className="text-gray-600">Housing Type:</span>
                                    <span className="ml-2 font-medium capitalize">
                                        {user.currentHousingType.replace('_', ' ')}
                                    </span>
                                </div>
                            )}
                            {user.location && (
                                <div>
                                    <span className="text-gray-600">Area Type:</span>
                                    <span className="ml-2 font-medium capitalize">{user.location}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-600">Owns House:</span>
                                <span className="ml-2 font-medium">{user.ownsHouse ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Person with Disability:</span>
                                <span className="ml-2 font-medium">{user.disability ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">No information provided yet.</p>
                            <Button 
                                onClick={() => setIsEditing(true)} 
                                variant="outline" 
                                className="mt-4"
                            >
                                Add Information
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Annual Household Income</label>
                            <Input
                                type="number"
                                value={formData.annualIncome}
                                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                                placeholder="Enter annual income"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Social Category</label>
                            <Select 
                                value={formData.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="sc">SC</SelectItem>
                                    <SelectItem value="st">ST</SelectItem>
                                    <SelectItem value="obc">OBC</SelectItem>
                                    <SelectItem value="minority">Minority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Housing Type</label>
                            <Select 
                                value={formData.currentHousingType}
                                onValueChange={(value) => handleInputChange('currentHousingType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select housing type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kutcha">Kutcha House (Temporary)</SelectItem>
                                    <SelectItem value="semi_pucca">Semi-Pucca House</SelectItem>
                                    <SelectItem value="rented">Rented</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Area Type</label>
                            <Select 
                                value={formData.location}
                                onValueChange={(value) => handleInputChange('location', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select area type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rural">Rural</SelectItem>
                                    <SelectItem value="urban">Urban</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                            <label className="text-sm font-medium">Own a Permanent House</label>
                            <Switch
                                checked={formData.ownsHouse}
                                onCheckedChange={(checked) => handleInputChange('ownsHouse', checked)}
                                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                            />
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                            <label className="text-sm font-medium">Person with Disability</label>
                            <Switch
                                checked={formData.disability}
                                onCheckedChange={(checked) => handleInputChange('disability', checked)}
                                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            type="button"
                            onClick={checkEligibility} 
                            className="flex-1"
                            disabled={isPending}
                        >
                            Check Eligibility
                        </Button>
                        <Button 
                            type="submit"
                            variant="outline" 
                            className="flex-1"
                            disabled={isPending}
                        >
                            Save Changes
                        </Button>
                        <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {eligibleSchemes.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Eligible Schemes</h3>
                    <div className="space-y-4">
                        {eligibleSchemes.map((scheme, index) => (
                            <div key={`scheme-${index}`} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium">{scheme.name}</h4>
                                {scheme.category && (
                                    <p className="text-sm text-gray-600">Category: {scheme.category}</p>
                                )}
                                {scheme.priority && (
                                    <p className="text-sm text-green-600">You may have priority status</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovtAidForm; 