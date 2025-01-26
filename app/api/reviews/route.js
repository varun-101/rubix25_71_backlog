import { writeClient } from "@/sanity/lib/write-client";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function POST(req) {
    try {
        const session = await auth();
        
        // Check if user is authenticated
        if (!session) {
            return Response.json({ 
                success: false, 
                message: "You must be logged in to leave a review" 
            }, { status: 401 });
        }

        // Get request data
        const { listingId, rating, review } = await req.json();

        // Validate required fields
        if (!listingId || !rating) {
            return Response.json({ 
                success: false, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return Response.json({ 
                success: false, 
                message: "Rating must be between 1 and 5" 
            }, { status: 400 });
        }

        // Create review object matching the schema structure
        const reviewObject = {
            _key: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            user: {
                _type: 'reference',
                _ref: session.user._id
            },
            rating: Number(rating),
            review: review || '',
            createdAt: new Date().toISOString()
        };

        // Add review to the listing's reviews array
        const result = await writeClient
            .patch(listingId)
            .setIfMissing({reviews: []})
            .append('reviews', [reviewObject])
            .commit();

        // Revalidate the listing page
        revalidatePath(`/listing/${listingId}`);

        return Response.json({ 
            success: true, 
            message: "Review submitted successfully",
            data: result 
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to submit review. Please try again." 
        }, { status: 500 });
    }
}

// Get reviews for a listing
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const listingId = searchParams.get('listingId');

        if (!listingId) {
            return Response.json({ 
                success: false, 
                message: "Listing ID is required" 
            }, { status: 400 });
        }

        // Query that matches the schema structure
        const query = `*[_type == "listing" && _id == $listingId][0] {
            "reviews": reviews[] {
                _key,
                rating,
                review,
                createdAt,
                "user": user->{
                    _id,
                    name,
                    image
                }
            }
        }`;

        const result = await writeClient.fetch(query, { listingId });

        return Response.json({ 
            success: true, 
            data: result?.reviews || [] 
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to fetch reviews" 
        }, { status: 500 });
    }
}

// Delete a review
export async function DELETE(req) {
    try {
        const session = await auth();
        
        if (!session) {
            return Response.json({ 
                success: false, 
                message: "Unauthorized" 
            }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const listingId = searchParams.get('listingId');
        const reviewKey = searchParams.get('reviewKey');

        if (!listingId || !reviewKey) {
            return Response.json({ 
                success: false, 
                message: "Listing ID and Review Key are required" 
            }, { status: 400 });
        }

        // Check if the review belongs to the user
        const listing = await writeClient.fetch(
            `*[_type == "listing" && _id == $listingId][0] {
                reviews[_key == $reviewKey && user._ref == $userId][0]
            }`,
            { 
                listingId,
                reviewKey,
                userId: session.user._id
            }
        );

        if (!listing?.reviews) {
            return Response.json({ 
                success: false, 
                message: "Review not found or unauthorized" 
            }, { status: 404 });
        }

        // Remove the review from the array
        const result = await writeClient
            .patch(listingId)
            .unset([`reviews[_key=="${reviewKey}"]`])
            .commit();

        // Revalidate the listing page
        revalidatePath(`/listing/${listingId}`);

        return Response.json({ 
            success: true, 
            message: "Review deleted successfully" 
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        return Response.json({ 
            success: false, 
            message: "Failed to delete review" 
        }, { status: 500 });
    }
}
