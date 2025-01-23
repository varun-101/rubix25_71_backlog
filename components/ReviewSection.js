'use client';

import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

const ReviewSection = ({ listingId, currentUser, reviews = [] }) => {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast({
                title: "Please login",
                description: "You need to be logged in to leave a review",
                variant: "destructive",
            });
            return;
        }

        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a rating before submitting",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingId,
                    rating,
                    review,
                    userId: currentUser._id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Review submitted",
                    description: "Thank you for your feedback!",
                });
                setRating(0);
                setReview('');
                // You might want to refresh the reviews here
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Reviews Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Reviews & Ratings</h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${
                                    star <= averageRating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-lg font-medium">{averageRating}</span>
                    <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleRatingClick(value)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-6 h-6 ${
                                        value <= rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Review</label>
                    <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this property..."
                        className="min-h-[100px] resize-none"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src={review.user.image}
                                        alt={review.user.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full border-2 border-gray-100"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(review._createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {review.rating}/5
                                </span>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            {review.review}
                        </p>
                        {/* <div className="mt-4 flex items-center gap-4">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ThumbsUp className="w-4 h-4 mr-0" />
                                Helpful
                            </Button>
                        </div> */}
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this property!
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
