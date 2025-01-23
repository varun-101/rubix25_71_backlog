import { client } from "@/sanity/lib/client";
import { LISTINGS_BY_USER } from "@/sanity/lib/queries";
import StartupCard from "./StartupCard";

export default async function UserListings({id}) {
    const listings = await client.fetch(LISTINGS_BY_USER, {id: id});
    console.log(listings);
    return <>
    {listings.length > 0 ? listings.map(post => (
        <StartupCard key={post._id} post={post} />
    )) : (
        <p className="no-result">No Listings Yet</p>
    )}
    
    </>
}