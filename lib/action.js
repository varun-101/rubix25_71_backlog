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

        console.log(formValues.location);

        const slug = slugify(formValues.title, { lower: true, strict: true });

        // Generate map URL with the listing's coordinates, with null check
        const mapUrl = formValues?.location?.lon && formValues?.location?.lat 
        ? `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${formValues.location.lon},${formValues.location.lat}&zoom=15.333&pitch=0.5&marker=lonlat:${formValues.location.lon},${formValues.location.lat};type:awesome;color:%23ee2b69;icon:home;strokecolor:%23000000;shadowcolor:%23ff0000&scaleFactor=2&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
        : null;

        // Fetch and upload the map image to Sanity
        let mapImageAsset = null;
        if (mapUrl) {
            try {
                const mapImage = await fetch(mapUrl);
                if (mapImage.ok) {
                    const blob = await mapImage.blob();
                    const imageBuffer = await blob.arrayBuffer();
                    const uploadedMapImage = await writeClient.assets.upload('image', Buffer.from(imageBuffer));
                    mapImageAsset = {
                        _type: 'image',
                        asset: {
                            _type: "reference",
                            _ref: uploadedMapImage._id
                        }
                    };
                }
            } catch (error) {
                console.error("Error fetching map image:", error);
            }
        }

        const doc = {
            _type: 'listing',
            title: formValues.title,
            description: formValues.description,
            slug: {
                _type: 'slug',
                current: slug
            },
            category: formValues.category,
            views: 0,
            bhk: Number(formValues.bhk),
            sqft: Number(formValues.sqft),
            furnishing: formValues.furnishing,
            mapImageUrl: mapImageAsset,
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
            location: {
                _type: 'geopoint',  // The type should match the schema type
                lat: formValues.location.lat,  // Use `lat` instead of `latitude`
                lng: formValues.location.lon   // Use `lng` instead of `longitude`
            },
            address: {
                street: formValues.location.street,
                city: formValues.location.city,
                state: formValues.location.state,
                country: formValues.location.country,
                pincode: formValues.location.postcode
            },
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

        const result = await writeClient.create(doc);
        

        return {
            ...result,
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
