import { UserIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const listing = defineType({
    name: "listing",
    title: "Listing",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title"
            },
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
        }),
        defineField({
            name: "user",
            type: "reference",
            to: {type: "user"},
        }),
        defineField({
            name: "views",
            title: "Views",
            type: "number",
        }),
        defineField({
            name: "deposit",
            title: "Security Deposit",
            type: "number",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "array",
            of: [{type: "image"}],
        }),
        defineField({
            name: "bhk",
            title: "BHK",
            type: "number",
            validation: Rule => Rule.precision(1)
        }),
        defineField({
            name: "sqft",
            title: "Area (sq.ft)",
            type: "number",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "string",
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
        }),
        defineField({
            name: "furnishing",
            title: "Furnishing Status",
            type: "string",
        }),
        defineField({
            name: "configuration",
            title: "Configuration",
            type: "object",
            fields: [
                {name: "bedrooms", type: "number", title: "Bedrooms"},
                {name: "bathrooms", type: "number", title: "Bathrooms"},
                {name: "balconies", type: "number", title: "Balconies"},
                {name: "parking", type: "number", title: "Parking Spots"},
            ]
        }),
        defineField({
            name: "location",
            title: "Location",
            type: "geopoint",
        }),
        defineField({
            name: "address",
            title: "Address",
            type: "object",
            fields: [
                {name: "street", type: "string", title: "Street"},
                {name: "city", type: "string", title: "City"},
                {name: "state", type: "string", title: "State"},
                {name: "country", type: "string", title: "Country"},
                {name: "pincode", type: "string", title: "Pincode"},
            ]
        }),
        defineField({
            name: "mapImageUrl",
            title: "Map Image",
            type: "image",
        }),
        defineField({
            name: "nearbyPlaces",
            title: "Nearby Places",
            type: "array",
            of: [{type: "object", fields: [
                {name: "name", type: "string", title: "Name"},
                {name: "address", type: "string", title: "Address"},
                {name: "distance", type: "number", title: "Distance"},
                {name: "category", type: "string", title: "Category"},
            ]}]
        }),
        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'user',
                        type: 'reference',
                        to: [{ type: 'user' }]
                    },
                    {
                        name: 'rating',
                        type: 'number',
                        validation: Rule => Rule.required().min(1).max(5)
                    },
                    {
                        name: 'review',
                        type: 'text'
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        initialValue: () => new Date().toISOString()
                    }
                ]
            }]
        }),
    ]
})