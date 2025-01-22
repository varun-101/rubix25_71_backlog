import { defineQuery } from "next-sanity";

export const LISTINGS_QUERY = defineQuery(`
    *[_type=='listing'] | order(views desc){
        _id, 
        _createdAt, 
        price, 
        title, 
        user ->{
            _id, 
            name, 
            image
        },
        category, 
        deposit, 
        "images": image[].asset->url, 
        description, 
        bhk,
        sqft
    }
`)