'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
    MapPin, 
    ChevronDown, 
    ChevronUp,
    Building2,
    Store,
    ShoppingBag,
    Utensils,
    Car
} from 'lucide-react';

const INITIAL_DISPLAY_COUNT = 6;
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'transport', label: 'Transport' },
    { id: 'education', label: 'Education', className: 'hidden lg:block' },
    { id: 'healthcare', label: 'Healthcare', className: 'hidden lg:block' }
];

// Helper function to get the appropriate icon for each category
const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('shop') || categoryLower.includes('store') || categoryLower.includes('commercial')) {
        return <Store className="h-5 w-5 text-blue-500" />;
    }
    if (categoryLower.includes('mall')) {
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
    }
    if (categoryLower.includes('restaurant') || categoryLower.includes('food') || categoryLower.includes('catering')) {
        return <Utensils className="h-5 w-5 text-orange-500" />;
    }
    if (categoryLower.includes('transport') || categoryLower.includes('station') || categoryLower.includes('service')) {
        return <Car className="h-5 w-5 text-green-500" />;
    }
    return <Building2 className="h-5 w-5 text-gray-500" />;
};

const NearbyPlacesSection = ({ places }) => {
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const getFilteredPlaces = () => {
        if (activeTab === 'all') return places;
        
        return places.filter(place => {
            const category = place.category?.toLowerCase() || '';
            switch (activeTab) {
                case 'shopping':
                    return category.includes('shop') || category.includes('store') || category.includes('mall') || category.includes('commercial');
                case 'restaurants':
                    return category.includes('restaurant') || category.includes('food') || category.includes('catering');
                case 'transport':
                    return category.includes('transport') || category.includes('station') || category.includes('bus') || category.includes('service');
                case 'education':
                    return category.includes('school') || category.includes('college') || category.includes('university');
                case 'healthcare':
                    return category.includes('hospital') || category.includes('clinic') || category.includes('pharmacy');
                default:
                    return false;
            }
        });
    };

    const filteredPlaces = getFilteredPlaces();
    const displayedPlaces = showAll ? filteredPlaces : filteredPlaces.slice(0, INITIAL_DISPLAY_COUNT);

    return (
        <section className="mt-10 space-y-6">
            <h3 className="text-2xl font-semibold">Nearby Places</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="shopping">Shopping</TabsTrigger>
                    <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                    <TabsTrigger value="education" className="hidden lg:block">Education</TabsTrigger>
                    <TabsTrigger value="healthcare" className="hidden lg:block">Healthcare</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedPlaces.map((place) => (
                            <Card key={place._key} className="hover:shadow-md transition-shadow">
                                <CardHeader className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{place.name}</CardTitle>
                                        {getCategoryIcon(place.category)}
                                    </div>
                                    <CardDescription className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        {place.address}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Distance</span>
                                        <span className="font-medium">
                                            {place.distance < 1 
                                                ? `${Math.round(place.distance * 1000)}m` 
                                                : `${place.distance.toFixed(1)}km`}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredPlaces.length > INITIAL_DISPLAY_COUNT && (
                        <div className="mt-6 text-center">
                            <Button
                                variant="outline"
                                onClick={() => setShowAll(!showAll)}
                                className="gap-2"
                            >
                                {showAll ? (
                                    <>
                                        Show Less
                                        <ChevronUp className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        View More
                                        <ChevronDown className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default NearbyPlacesSection; 