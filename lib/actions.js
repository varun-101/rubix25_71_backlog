'use server'

import { writeClient } from "@/sanity/lib/write-client";

export async function updateUserGovtAidInfo(userId, formData) {
    try {
        // console.log("Updating user:", userId);
        // console.log("With data:", formData);

        // Convert annualIncome to number if it exists
        const updates = {
            ...formData,
            annualIncome: formData.annualIncome ? Number(formData.annualIncome) : undefined,
            _type: 'user'  // Add document type
        };

        // Remove any undefined values
        Object.keys(updates).forEach(key => 
            updates[key] === undefined && delete updates[key]
        );

        const result = await writeClient
            .patch(userId)
            .set(updates)
            .commit({autoGenerateArrayKeys: true});

        // console.log("Update result:", result);
        
        return {
            success: true,
            message: "Information updated successfully"
        };
    } catch (error) {
        console.error('Error updating user info:', error);
        return {
            success: false,
            message: error.message || "Failed to update information"
        };
    }
} 