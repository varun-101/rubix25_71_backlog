import { performSearch } from '@/lib/search';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type');

    // Perform your async operations here
    const results = await performSearch(query, type);

    return Response.json({ results });
} 