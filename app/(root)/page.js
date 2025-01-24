import SearchContainer from "@/components/SearchContainer";
import StartupCard from "@/components/StartupCard";
import { client } from "@/sanity/lib/client";
import { LISTINGS_QUERY } from "@/sanity/lib/queries";

export default async function Home({ searchParams }) {
    // Server-side data fetching
    const query = (await searchParams)?.query || null;
    const category = (await searchParams)?.category || 'rent';
    
    const posts = await client.fetch(LISTINGS_QUERY, {
        query,
        category
    });

    return (
        <>
            <section className="pink_container">
                <h1 className="heading">Find Affordable Housing, <br /> Connect with Communities</h1>
                <p className="sub-heading max-w-3xl">Search Listings, Access Aid Programs, and Read Community Reviews</p>
                <SearchContainer initialSearchParams={searchParams} />
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Search results for "${query}"` : `All ${category} Listings`}
                </p>

                <ul className="mt-7 card_grid">
                    {posts?.length > 0 ? (
                        posts.map((post) => (
                            <StartupCard key={post._id} post={post} />
                        ))
                    ) : (
                        <p className="no-results">No Listings Found</p>
                    )}
                </ul>
            </section>
        </>
    );
}
