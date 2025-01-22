import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import ListingForm from "@/components/ListingForm";

const Page = async () => {
    const session = await auth();
    if(!session) redirect('/');

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">LIST YOUR PROPERTY</h1>
                {/* <p className="sub-heading !max-w-3xl">{post.description}</p> */}
            </section>
            <ListingForm />
        </>
    )
}

export default Page;
