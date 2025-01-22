"use client";
import React, { useState } from "react";
import SearchFormReset from "./SearchFormReset";
import SearchTabs from "./SearchTabs";
import { Search } from "lucide-react";

const SearchForm = ({ searchParams }) => {
    const [activeTab, setActiveTab] = useState('rent');
    const query = searchParams?.query || '';

    const placeholders = {
        rent: "Search Rental Properties",
        buy: "Search Properties for Sale",
        plots: "Search Plots and Land"
    };

    return (
        <div className="w-full max-w-3xl">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <form action="/" className="search-form">
                <input 
                    name="query"
                    defaultValue={query}
                    className="search-input"
                    placeholder={placeholders[activeTab]}
                />
                <input 
                    type="hidden" 
                    name="type" 
                    value={activeTab}
                />
                <div className="flex gap-2">
                    {query && <SearchFormReset />}
                    <button type="submit" className="search-btn text-white">
                        <Search className="size-5"/>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;