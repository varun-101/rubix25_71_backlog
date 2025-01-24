"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ApplicationForm = ({ listingId, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.target);
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingId,
                    message: formData.get('message'),
                    phone: formData.get('phone'),
                    occupation: formData.get('occupation'),
                    moveInDate: formData.get('moveInDate')
                }),
            });

            if (!response.ok) throw new Error();

            toast({
                title: "Application Submitted",
                description: "Your application has been sent to the property owner.",
            });

            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-full mb-3">Apply Now</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Application Details</h4>
                        <p className="text-sm text-muted-foreground">
                            Please provide additional information for your application.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="occupation"
                            name="occupation"
                            placeholder="Occupation"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="moveInDate"
                            name="moveInDate"
                            type="date"
                            placeholder="Preferred Move-in Date"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Message to the owner (optional)"
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default ApplicationForm; 