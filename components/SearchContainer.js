"use client";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import SearchTabs from "./SearchTabs";

const SearchContainer = ({ searchParams }) => {
    const [activeTab, setActiveTab] = useState('rent');

    return (
        <div className="w-full max-w-3xl">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchForm searchParams={searchParams} activeTab={activeTab} />
        </div>
    );
};

export default SearchContainer; 