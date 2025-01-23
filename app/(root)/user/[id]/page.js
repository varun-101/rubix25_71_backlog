import { auth } from "@/app/api/auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";
import { USER_BY_ID } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserListings from "@/components/UserListings";

const page = async ({params}) => {
    const id = (await params).id;
    console.log(id);
    
    const session = await auth();
    const user = await client.fetch(USER_BY_ID, {id: id});
    console.log(user);

    if (!user) {
        return notFound();
    }

    return (
        <>
            <section className="profile_container">
                <div className="profile_card">
                    <div className="profile_title">
                        <h3 className="text-24-black uppercase text-center line-clamp-1">
                            {user.name}
                        </h3>
                    </div>
                    <Image 
                        src={user.image}
                        alt={user.name}
                        width={220}
                        height={220}
                        className="profile_image"
                    />

                    <p className="text-30-extrabold mt-7 text-center">{user.email}</p>
                    <p className="mt-1 text-center text-14-normal">{user.bio}</p>
                </div>

                <div className="flex-1 flex flex-col gap-5 lg:mt-5">
                    <p className="text-30-bold">
                        {session.user._id == id ? "Your" : "All"} Listings
                    </p>

                    <ul className="card_grid-sm">
                    <UserListings id={id}/>
                    </ul>

                </div>
            </section>
        </>
    )
}

export default page;