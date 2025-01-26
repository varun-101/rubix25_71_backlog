import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { SEARCH_LISTINGS } from "@/sanity/lib/queries";

export async function performSearch(query, type, options = {}) {
    try {
        const {
            minPrice,
            maxPrice,
            bhk,
            city
        } = options;

        const searchParams = {
            query: query ? `*${query}*` : "",
            type: type || "all",
            minPrice: minPrice ? parseInt(minPrice) : null,
            maxPrice: maxPrice ? parseInt(maxPrice) : null,
            bhk: bhk ? parseInt(bhk) : null,
            city: city ? `*${city}*` : null
        };

        const results = await client.fetch(SEARCH_LISTINGS, searchParams);
        return results;

    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}