import React from "react";

const SearchTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'rent', label: 'Rent' },
        { id: 'buy', label: 'Buy' },
        { id: 'plots', label: 'Plots/Land' }
    ];

    return (
        <div className="flex gap-2 mb-0 mt-4 justify-center">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`category-tag ${
                        activeTab === tab.id 
                        ? '!bg-black text-white' 
                        : 'bg-primary-100 hover:bg-gray-700 hover:text-white'
                    } transition-all duration-300`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SearchTabs;
