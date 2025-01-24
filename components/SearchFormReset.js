"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const SearchFormReset = ({ onClick, activeTab }) => {
    const router = useRouter();

    const handleReset = () => {
        // Call the parent's reset function to clear the input
        onClick();
        // Reset the URL while maintaining the active tab
        router.push(`/?category=${activeTab}`);
    };

    return (
        <button 
            type="button" 
            onClick={handleReset}
            className="search-btn text-white"
        >
            <X className="size-5" />
        </button>
    );
};

export default SearchFormReset;