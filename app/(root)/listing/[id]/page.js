import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { LISTING_BY_ID } from "@/sanity/lib/queries";
import View from "@/components/View";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
    BedDouble, 
    Bath, 
    Warehouse,
    Car, 
    Home, 
    IndianRupee, 
    MapPin, 
    Share2,
    ArrowRight,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const page = async ({params}) => {
    const id = (await params).id;
    const post = await client.fetch(LISTING_BY_ID, {id: id});

    // Format the address for display
    const formattedAddress = post?.address 
        ? `${post.address.street ? post.address.street + ', ' : ''}${post.address.city ? post.address.city + ', ' : ''}${post.address.state || ''}`
        : "Location not specified";

    return (
        <>
            {/* Hero Section */}
            <section className="pink_container !min-h-[230px]">
                <div className="items-center gap-2">
                    <p className="tag">Listed on {formatDate(post._createdAt)}</p>
                    <Badge variant="secondary" className={"tag justify-center mt-2 flex-wrap"}>
                        {post.category === 'rent' ? 'For Rent' : post.category === 'sale' ? 'For Sale' : 'Plot/Land'}
                    </Badge>
                </div>
                <h1 className="heading">{post.title}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <p className="text-lg">{formattedAddress}</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="section_container">
                {/* Image Carousel */}
                <div className="w-full max-w-5xl mx-auto">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {post.images.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                                        <Image 
                                            src={img}
                                            alt={`Property Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                {/* Property Details and Contact Card */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Price and Actions */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500">Price</p>
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="h-6 w-6" />
                                    <h2 className="text-3xl font-bold">{post.price.toLocaleString('en-IN')}</h2>
                                </div>
                                {post.category === 'rent' && (
                                    <div className="mt-2">
                                        <p className="text-gray-500">Security Deposit</p>
                                        <p className="text-xl font-semibold">₹{post.deposit.toLocaleString('en-IN')}</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Property Configuration */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex flex-col items-center gap-2">
                                <Home className="h-6 w-6 text-primary" />
                                <p className="text-gray-500">BHK</p>
                                <p className="font-semibold">{post.bhk}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <BedDouble className="h-6 w-6 text-primary" />
                                <p className="text-gray-500">Bedrooms</p>
                                <p className="font-semibold">{post.configuration.bedrooms}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Bath className="h-6 w-6 text-primary" />
                                <p className="text-gray-500">Bathrooms</p>
                                <p className="font-semibold">{post.configuration.bathrooms}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Building2 className="h-6 w-6 text-primary" />
                                <p className="text-gray-500">Balconies</p>
                                <p className="font-semibold">{post.configuration.balconies}</p>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Property Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Carpet Area</span>
                                        <span className="font-medium">{post.sqft} sq.ft</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Furnishing</span>
                                        <span className="font-medium capitalize">{post.furnishing}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Parking Spots</span>
                                        <span className="font-medium">{post.configuration.parking}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">Description</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{post.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 bg-white border rounded-xl shadow-sm">
                            <Link href={`/user/${post.user._id}`} className="flex items-center gap-4 mb-6">
                                <Image 
                                    src={post.user.image}
                                    alt={post.user.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold">{post.user.name}</h3>
                                    <p className="text-gray-500">@{post.user.username}</p>
                                </div>
                            </Link>
                            <Button className="w-full mb-3">Contact Owner</Button>
                            <Button variant="outline" className="w-full">
                                View Profile
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Location Map Section - Now below the grid */}
                {post.mapImageUrl && (
                    <div className="mt-10 space-y-4">
                        <h3 className="text-xl font-semibold">Location</h3>
                        <div className="relative aspect-[3/2] w-full max-w-5xl mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <img
                                src={post.mapImageUrl}
                                alt={`Map showing location of ${post.title}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <p>{formattedAddress}</p>
                        </div>
                    </div>
                )}

                <hr className="divider"/>
            </section>

            {/* Views Counter */}
            <Suspense fallback={<Skeleton className="view_skeleton"/>}>
                <View id={id}/>
            </Suspense>
        </>
    )
}

export default page;