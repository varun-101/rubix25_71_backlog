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

export const LISTING_BY_ID = defineQuery(`
    *[_type=='listing' && _id == $id][0]{
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
        "mapImageUrl": mapImageUrl.asset->url,
        views,
        configuration,
        furnishing,
        location {
            lat,
            lng
        },
        address {
            street,
            city,
            state,
            country,
            pincode
        }

    }
`)


export const VIEW_COUNT = defineQuery(`
    *[_type=='listing' && _id == $id][0]{
        views
    }
`)
