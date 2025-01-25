import React from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const StartupCard = async ({ post }) => {
    const posts = await post;

    return (
        <li className="startup-card group relative">
            {/* Sold Out Overlay */}
            {posts.isSold == true && (
                <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                    <Image
                        src="/soldout.png"
                        alt="Sold Out"
                        width={200}
                        height={100}
                        className="transform -rotate-12"
                    />
                </div>
            )}

            {/* Card Content */}
            <div className="relative z-10">
                <div className="flex-between">
                    <p>{formatDate(posts._createdAt)}</p>
                    <div className="flex gap-1.5">
                        <EyeIcon className="size-6 text-primary" />
                        <span className="text-16-medium">{posts.views}</span>
                    </div>
                </div>

                <div className="flex-between mt-5 gap-5">
                    <div>
                        <Link href={`/user/${posts.user._id}`}>
                            <p className="text-16-medium line-cramp-1">{posts.user.name}</p>
                        </Link>

                        <Link href={`/listing/${posts._id}`}>
                            <div className="flex-center gap-1">
                                <h3 className="text-26-semibold line-clamp-1 mb-0">
                                    {formatPrice(posts.price)}
                                    <span className="text-16-medium"> /month</span>
                                </h3>
                                <p className="text-16-light mt-0">
                                    Deposit: {formatPrice(posts.deposit)}
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="h-16 w-[2px] bg-black/15 rounded-full" />

                    <div>
                        <h3 className="text-26-semibold line-clamp-1 mb-0 mt-6">
                            {posts.bhk} BHK
                        </h3>
                        <p className="text-16-light mt-0">{posts.sqft} sqft</p>
                    </div>

                    <Link href={`/user/${posts.user._id}`}>
                        <Image
                            src={posts.user.image}
                            alt="placeholder"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                    </Link>
                </div>

                <p className="startup-card_desc">{posts.description}</p>

                <Carousel>
                    <CarouselContent>
                        {posts.images?.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video w-full">
                                    <Image
                                        src={image}
                                        alt={`Property image ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-2xl object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute mt-0 left-0 bg-black text-white" />
                    <CarouselNext className="absolute mt-0 right-0 bg-black text-white" />
                </Carousel>

                <div className="flex-between mt-3">
                    <Link href={`/?query=${posts.category.toLowerCase()}`}>
                        <p className="text-16-medium">{posts.category}</p>
                    </Link>

                    <Link href={`/listing/${posts._id}`}>
                        <Button className="startup-card_btn">Details</Button>
                    </Link>
                </div>
            </div>
        </li>
    );
};

export default StartupCard;
