'use server'

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

export const createListing = async (prevState, formData, formValues) => {
    console.log(formValues);
    const session = await auth();
    console.log(session);
    if (!session?.user?._id) {
        console.log("Unauthorized");
        return {
            error: "Unauthorized",
            status: "ERROR"
        }
    }
    try {
        const imageAssets = await Promise.all(
            formValues.images.map(async (image) => {
                const imageBuffer = await image.arrayBuffer();
                return writeClient.assets.upload('image', Buffer.from(imageBuffer));
            })
        );

        const slug = slugify(formValues.title, { lower: true, strict: true });

        const doc = {
            _type: 'listing',
            title: formValues.title,
            description: formValues.description,
            slug: {
                _type: 'slug',
                current: slug
            },
            category: formValues.category,
            bhk: Number(formValues.bhk),
            sqft: Number(formValues.sqft),
            furnishing: formValues.furnishing,
            configuration: {
                bedrooms: Number(formValues.configuration.bedrooms),
                bathrooms: Number(formValues.configuration.bathrooms), 
                balconies: Number(formValues.configuration.balconies),
                parking: Number(formValues.configuration.parking)
            },
            user: {
                _type: 'reference',
                _ref: session.user._id
            },
            price: Number(formValues.price),
            image: imageAssets.map((asset, index) => ({
                _key: `image${index}_${Date.now()}`,
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: asset._id
                }
            }))
        };

        if (formValues.category === "rent") {
            doc.deposit = Number(formValues.deposit);
        }

        await writeClient.create(doc);

        return {
            status: "SUCCESS"
        };

    } catch (error) {
        console.error("Error creating listing:", error);
        return {
            error: "Failed to create listing",
            status: "ERROR"
        };
    }
}
