"use client";
import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LocationInput = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLocations = async () => {
            if (searchQuery.length < 3) {
                setLocations([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&format=json&limit=5&filter=countrycode:in&lang=en&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();

                // console.log(data);

                if (!data.results || data.results.length === 0) {
                    setLocations([]);
                    return;
                }
                
                const formattedLocations = data.results.map((result, index) => ({
                    id: `location-${index}-${Date.now()}`,
                    value: result.formatted,
                    label: result.formatted,
                    details: {
                        address_line1: result.address_line1,
                        address_line2: result.address_line2,
                        formatted: result.formatted,
                        lat: result.lat,
                        lon: result.lon,
                        city: result.city,
                        state: result.state,
                        country: result.country,
                        postcode: result.postcode,
                        district: result.district,
                        neighbourhood: result.neighbourhood,
                        street: result.street
                    }
                }));
                
                setLocations(formattedLocations);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setLocations([]);
            }
        };

        const debounceTimer = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value?.formatted || "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className="bg-white max-w-2xl">
                    <CommandInput 
                        placeholder="Search location..." 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="h-9"
                    />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {locations.map((location) => (
                            <CommandItem
                                key={location.id}
                                value={location.value}
                                onSelect={() => {
                                    onChange(location.details);
                                    setSearchQuery(location.value);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value?.formatted === location.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {location.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default LocationInput; 