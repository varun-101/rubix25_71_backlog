import { writeClient } from "@/sanity/lib/write-client";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Create a new application
export async function POST(req) {
    try {
        const session = await auth();
        
        if (!session) {
            return Response.json({ 
                success: false, 
                message: "You must be logged in to apply" 
            }, { status: 401 });
        }
        
        const { listingId, message, phone, occupation, moveInDate } = await req.json();

        console.log(listingId, message, phone, occupation, moveInDate);

        // Validate required fields
        if (!listingId || !phone || !occupation || !moveInDate) {
            return Response.json({ 
                success: false, 
                message: "Missing required fields",
                details: {
                    listingId: !listingId ? "Listing ID is required" : null,
                    phone: !phone ? "Phone number is required" : null,
                    occupation: !occupation ? "Occupation is required" : null,
                    moveInDate: !moveInDate ? "Move-in date is required" : null
                }
            }, { status: 400 });
        }

        // Check if user has already applied
        const existingApplication = await writeClient.fetch(
            `*[_type == "application" && listing._ref == $listingId && applicant._ref == $userId][0]`,
            { 
                listingId,
                userId: session.user._id
            }
        );

        // console.log(existingApplication);

        if (existingApplication) {
            return Response.json({ 
                success: false, 
                message: "You have already applied for this listing" 
            }, { status: 400 });
        }

        // Create application document
        const applicationDoc = {
            _type: 'application',
            listing: {
                _type: 'reference',
                _ref: listingId
            },
            applicant: {
                _type: 'reference',
                _ref: session.user._id
            },
            status: 'pending',
            message: message || '',
            phone,
            occupation,
            moveInDate: new Date(moveInDate).toISOString(),
            _createdAt: new Date().toISOString()
        };

        // Create the application in Sanity
        const result = await writeClient.create(applicationDoc);

        // Revalidate the applications page
        revalidatePath(`/listing/${listingId}/applications`);

        return Response.json({ 
            success: true, 
            message: "Application submitted successfully",
            data: result 
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to submit application",
            error: error.message
        }, { status: 500 });
    }
}

// Update application status
export async function PATCH(req) {
    try {
        const session = await auth();
        
        if (!session) {
            return Response.json({ 
                success: false, 
                message: "Unauthorized" 
            }, { status: 401 });
        }

        const { applicationId, status } = await req.json();

        if (!applicationId || !status) {
            return Response.json({ 
                success: false, 
                message: "Application ID and status are required" 
            }, { status: 400 });
        }

        // Verify the user is the listing owner
        const application = await writeClient.fetch(`
            *[_type == "application" && _id == $applicationId]{
                _id,
                listing->{
                    _id,
                    user->{_id}
                }
            }[0]
        `, { applicationId });

        if (!application?.listing?.user?._id === session.user._id) {
            return Response.json({ 
                success: false, 
                message: "Unauthorized to update this application" 
            }, { status: 403 });
        }

        // Update the application status
        const result = await writeClient
            .patch(applicationId)
            .set({ status })
            .commit();

        // Update the listing document
        await writeClient.patch(application.listing._id).set({ isSold: true }).commit();

        // Revalidate the applications page
        revalidatePath(`/listing/${application.listing._id}/applications`);

        return Response.json({ 
            success: true, 
            message: "Application status updated successfully",
            data: result 
        });

    } catch (error) {
        console.error('Error updating application:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to update application status" 
        }, { status: 500 });
    }
}
