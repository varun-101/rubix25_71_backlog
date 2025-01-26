import { defineQuery } from "next-sanity";

export const LISTINGS_QUERY = defineQuery(`
    *[_type=='listing' && category == $category && isSold != true && ($query == null || (title match $query || description match $query || address.city match $query || address.state match $query || address.country match $query || address.pincode match $query || address.street match $query ))] | order(views desc){
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
        isSold,
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
            image,
            email
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
        nearbyPlaces,
        furnishing,
        location,
        address,
        reviews[] {
            _id,
            rating,
            review,
            _createdAt,
            user->
        }
    }
`)

export const VIEW_COUNT = defineQuery(`
    *[_type=='listing' && _id == $id][0]{
        views
    }
`)

export const USER_BY_ID = defineQuery(`
    *[_type=='user' && _id == $id][0]{
        _id,
        id, 
        name, 
        email, 
        image,
        annualIncome,
        ownsHouse,
        category,
        disability,
        currentHousingType,
        location
    }
`)

export const LISTINGS_BY_USER = defineQuery(`
    *[_type=='listing' && user->_id == $id] | order(views desc){
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
        isSold,
        views
    }
`)

export const SEARCH_LISTINGS = defineQuery(`
    *[_type=='listing' && isSold != true && 
      ($type == "all" || category == $type) &&
      ($query == "" || 
        title match $query || 
        description match $query || 
        address.city match $query || 
        address.state match $query || 
        address.street match $query ||
        address.pincode match $query
      ) &&
      ($minPrice == null || price >= $minPrice) &&
      ($maxPrice == null || price <= $maxPrice) &&
      ($bhk == null || bhk == $bhk) &&
      ($city == null || address.city match $city)
    ] | order(views desc) {
        _id,
        _createdAt,
        title,
        price,
        category,
        bhk,
        sqft,
        views,
        "images": image[].asset->url,
        description,
        address,
        user->{
            _id,
            name,
            image
        }
    }
`)



