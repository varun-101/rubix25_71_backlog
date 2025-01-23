import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";
import Image from "next/image";
import SearchContainer from "@/components/SearchContainer";
import { client } from "@/sanity/lib/client";
import { LISTINGS_QUERY } from "@/sanity/lib/queries";

export default async function Home({searchParams}) {
  const query = (await searchParams)?.query || null;
  const params = {Search: query}
  // const posts = [{
  //   _createdAt: new Date(),
  //   _id: '1',
  //   price: '50,000',
  //   author: {
  //     _id: '1',
  //     name: 'Varun',
  //     image: '/logo.png'
  //   },
  //   views: 100,
  //   deposit: '1,50,000',
  //   bhk: '2',
  //   sqft: '1000',
  //   description: 'This is a test description',
  //   category: 'Rent',
  //   image: ['/logo.png', '/logo.png', '/logo.png']  
  // }];
  const posts = await client.fetch(LISTINGS_QUERY)
  // console.log(posts)
  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Find Affordable Housing, <br /> Connect with Communities</h1>
      <p className="sub-heading max-w-3xl">Search Listings, Access Aid Programs, and Read Community Reviews</p>
      
      <SearchContainer searchParams={searchParams} />
    </section>

    <section className="section_container">
      <p className="text-30-semibold">
        {query ? `Search results for "${query}"` : "All Listings"}
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
