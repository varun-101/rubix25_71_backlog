'use client';

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShareButton() {
    const { toast } = useToast();

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            
            toast({
                title: "Link copied!",
                description: "The listing URL has been copied to your clipboard.",
                variant: "default",
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Could not copy the link to clipboard.",
                variant: "destructive",
            });
        }
    };

    return (
        <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
        </Button>
    );
}