import React from "react";
import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Playwrite_CA } from "next/font/google";
import { Button } from "./ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

const StartupCard = ({post}) =>{
    


    return (
        <li className="startup-card group">
            <div className="flex-between">
                <p>
                    {formatDate(post._createdAt)}
                </p>
                <div className="flex gap-1.5">
                    <EyeIcon className="size-6 text-primary"/>
                    <span className="text-16-medium">{post.views}</span>
                </div>
            </div>
            <div className="flex-between mt-5 gap-5">
                <div>
                    <Link href={`/user/${post.author._id}`}>
                        <p className="text-16-medium line-cramp-1">{post.author.name}</p>
                    </Link>
                    <Link href={`/startup/${post._id}`}>
                    <div className="flex-center gap-1">
                        <h3 className="text-26-semibold line-clamp-1 mb-0">₹{post.price}<span className="text-16-medium"> /month</span></h3>
                        <p className="text-16-light mt-0">Deposit: ₹{post.deposit}</p>
                    </div>
                    </Link>
                </div>
                <div className="h-16 w-[2px] bg-black/15 rounded-full" />
                <div>
                    <h3 className="text-26-semibold line-clamp-1 mb-0 mt-6">{post.bhk} BHK</h3>
                    <p className="text-16-light mt-0">{post.sqft} sqft</p>
                </div>
                <Link href={`/user/${post.author._id}`}>
                    <Image 
                        src={post.author.image}
                        alt="placeholder"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </Link>
            </div>
            
            {/* <Link href={`/startup/${post._id}`}> */}
                <p className="startup-card_desc">{post.description}</p>

                {/* <img 
                    src={post.image}
                    alt="placeholder"
                    className="rounded-2xl w-full"
                /> */}

                <Carousel>
                    <CarouselContent>
                        {post.image.map((image, index) => (
                            <CarouselItem key={index}>
                                <Image src={image} alt="placeholder" className="rounded-2xl w-full" width={400} height={400} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute mt-0 left-0" />
                    <CarouselNext className="absolute mt-0 right-0" />
                </Carousel>

            {/* </Link> */}

            <div className="flex-between mt-3">
                <Link href={`/?query=${post.category.toLowerCase()}`}>
                    <p className="text-16-medium">{post.category}</p>
                </Link>

                <Link href={`/startup/${post._id}`}>
                    <Button className="startup-card_btn">Details</Button>
                </Link>
            </div>
        </li>
    )
}

export default StartupCard