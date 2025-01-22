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
            type: "string",
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
            title: "Deposit",
            type: "string",
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
            title: "Sqft",
            type: "string",
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
    ],
})