'use server'

import { performSearch } from '@/lib/search';

export async function searchAction(formData) {
    const query = formData.get('query');
    const type = formData.get('type');
    
    // Perform the search using our utility function
    const results = await performSearch(query, type);
    
    // Redirect to the search results page
    // You can modify this based on your routing needs
    return results;
} 