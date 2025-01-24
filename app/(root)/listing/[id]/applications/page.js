import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ApplicationsList from "@/components/ApplicationsList";

const ApplicationsPage = async ({ params }) => {
    const session = await auth();
    if (!session) redirect('/');

    const listing = await client.fetch(`
        *[_type == "listing" && _id == $id][0]{
            _id,
            title,
            user->{_id},
            "applications": *[_type == "application" && references(^._id)]{
                _id,
                _createdAt,
                status,
                message,
                applicant->{
                    _id,
                    name,
                    email,
                    image,
                    phone,
                    occupation
                }
            }
        }
    `, { id: (await params).id });

    // Check if user is the owner
    if (listing.user._id !== session.user._id) {
        redirect('/');
    }

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">Applications</h1>
                <p className="sub-heading">
                    Manage applications for your listing: {listing.title}
                </p>
            </section>

            <section className="section_container">
                <ApplicationsList applications={listing.applications} listingId={listing._id} />
            </section>
        </>
    );
};

export default ApplicationsPage;