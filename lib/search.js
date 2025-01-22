export async function performSearch(query, type) {
    try {
        // You can replace this with your actual search logic
        // For example, fetching from your database or API
        const response = await fetch(`/api/properties?query=${query}&type=${type}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}