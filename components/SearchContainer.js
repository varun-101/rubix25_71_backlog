"use client";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import SearchTabs from "./SearchTabs";

// This component handles only client-side state and UI interactions
const SearchContainer = ({ initialSearchParams }) => {
    const [activeTab, setActiveTab] = useState('rent');

    return (
        <div className="w-full max-w-3xl">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchForm initialSearchParams={initialSearchParams} activeTab={activeTab} />
        </div>
    );
};

export default SearchContainer; 