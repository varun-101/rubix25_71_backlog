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
            type: "string",
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
    ],
})