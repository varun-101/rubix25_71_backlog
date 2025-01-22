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
        sqft,
        views
    }
`)

export const USER_BY_GOOGLE_ID = defineQuery(`
    *[_type=='user' && id == $id][0]{
        _id, 
        name, 
        email, 
        image
    }
`)
