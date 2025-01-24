"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ initialSearchParams, activeTab }) => {
    const router = useRouter();
    const [query, setQuery] = useState(initialSearchParams?.query || "");

    const placeholders = {
        rent: "Search Rental Properties",
        buy: "Search Properties for Sale",
        plots: "Search Plots and Land"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        params.set("category", activeTab);
        router.push(`/?${params.toString()}`);
    };

    // Update search when tab changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        params.set("category", activeTab);
        router.push(`/?${params.toString()}`);
    }, [activeTab]);

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                placeholder={placeholders[activeTab]}
            />
            <input 
                type="hidden" 
                name="category" 
                value={activeTab}
            />
            <div className="flex gap-2">
                {query && (
                    <SearchFormReset 
                        onClick={() => setQuery("")} 
                        activeTab={activeTab}
                    />
                )}
                <button type="submit" className="search-btn text-white">
                    <Search className="size-5"/>
                </button>
            </div>
        </form>
    );
};

export default SearchForm;