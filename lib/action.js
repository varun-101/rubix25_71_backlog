'use server'

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";
import { calculateDistance } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createListing = async (prevState, formData, formValues) => {
    // console.log(formValues);
    const session = await auth();
    // console.log(session);
    if (!session?.user?._id) {
        console.log("Unauthorized");
        return {
            error: "Unauthorized",
            status: "ERROR"
        }
    }
    try {
        // const imageAssets = await Promise.all(
        //     formValues.images.map(async (image) => {
        //         const imageBuffer = await image.arrayBuffer();
        //         return writeClient.assets.upload('image', Buffer.from(imageBuffer));
        //     })
        // );

        // console.log(formValues.location);

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

        const nearbyPlaces = await fetch(`https://api.geoapify.com/v2/place-details?lat=${formValues.location.lat}&lon=${formValues.location.lon}&features=building,walk_10,drive_5,walk_10.supermarket,drive_5.shopping_mall,drive_5.fuel,drive_5.supermarket,radius_500,radius_500.restaurant&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
        let nearbyPlacesData = await nearbyPlaces.json();
        nearbyPlacesData = nearbyPlacesData.features.map(place => {
            if (!place.properties.name) return null;
            return {
                _key: `place_${place.properties.place_id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: place.properties.name,
                address: place.properties.address_line1,
                distance: calculateDistance(formValues.location.lat, formValues.location.lon, place.geometry.coordinates[1], place.geometry.coordinates[0]),
                category: place.properties.categories ? place.properties.categories[0] : 'Other'
            };
        }).filter(place => place !== null);
        // console.log(nearbyPlacesData);
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
            nearbyPlaces: nearbyPlacesData,
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
            image: formValues.image.map((img) => ({
                ...img,
                _key: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }))
        }

        if (formValues.category === "rent") {
            doc.deposit = Number(formValues.deposit);
        }

        const result = await writeClient.create(doc);
        
        revalidatePath("/");
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
