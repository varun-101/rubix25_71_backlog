import { writeClient } from "@/sanity/lib/write-client";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const type = searchParams.get('type') || 'all';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bhk = searchParams.get('bhk');
        const city = searchParams.get('city');

        // Build the GROQ query
        let searchQuery = `*[_type == "listing" && isSold != true`;

        // Add category filter
        if (type && type !== 'all') {
            searchQuery += ` && category == "${type}"`;
        }

        // Add search term filter
        if (query) {
            searchQuery += ` && (
                title match "*${query}*" || 
                description match "*${query}*" || 
                address.city match "*${query}*" || 
                address.state match "*${query}*" || 
                address.street match "*${query}*" ||
                address.pincode match "*${query}*"
            )`;
        }

        // Add price range filter
        if (minPrice) {
            searchQuery += ` && price >= ${minPrice}`;
        }
        if (maxPrice) {
            searchQuery += ` && price <= ${maxPrice}`;
        }

        // Add BHK filter
        if (bhk) {
            searchQuery += ` && bhk == ${bhk}`;
        }

        // Add city filter
        if (city) {
            searchQuery += ` && address.city match "*${city}*"`;
        }

        // Close the query and add sorting and projection
        searchQuery += `] | order(views desc) {
            _id,
            _createdAt,
            title,
            price,
            category,
            bhk,
            sqft,
            views,
            "images": image[].asset->url,
            description,
            address,
            user->{
                _id,
                name,
                image
            }
        }`;

        // Execute the query
        const results = await writeClient.fetch(searchQuery);

        return Response.json({ 
            success: true,
            results 
        });

    } catch (error) {
        console.error('Search error:', error);
        return Response.json({ 
            success: false,
            error: "Failed to perform search",
            results: [] 
        }, { status: 500 });
    }
} 