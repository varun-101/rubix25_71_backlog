import SearchForm from "@/components/SearchForm";
import Image from "next/image";

export default function Home({searchParams}) {
  return (
    <section className="pink_container">
      <h1 className="heading">Find Affordable Housing, <br /> Connect with Communities</h1>
      <p className="sub-heading max-w-3xl">Search Listings, Access Aid Programs, and Read Community Reviews</p>
      
      <SearchForm searchParams={searchParams} />
    </section>
  );
}
