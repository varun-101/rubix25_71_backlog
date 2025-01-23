import { UserIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const user = defineType({
    name: "user",
    title: "User",
    type: "document",
    icon: UserIcon,
    fields: [
        defineField({
            name: "id",
            title: "ID",
            type: "string",
        }),
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "string",
        }),
        defineField({
            name: "number",
            title: "Number",
            type: "string",
        }),
        // Government Aid Fields
        defineField({
            name: "annualIncome",
            title: "Annual Income",
            type: "number",
        }),
        defineField({
            name: "ownsHouse",
            title: "Owns House",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "category",
            title: "Social Category",
            type: "string",
            options: {
                list: [
                    {title: 'General', value: 'general'},
                    {title: 'SC', value: 'sc'},
                    {title: 'ST', value: 'st'},
                    {title: 'OBC', value: 'obc'},
                    {title: 'Minority', value: 'minority'},
                ]
            }
        }),
        defineField({
            name: "disability",
            title: "Person with Disability",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "currentHousingType",
            title: "Current Housing Type",
            type: "string",
            options: {
                list: [
                    {title: 'Kutcha House (Temporary)', value: 'kutcha'},
                    {title: 'Semi-Pucca House', value: 'semi_pucca'},
                    {title: 'Rented', value: 'rented'},
                    {title: 'Other', value: 'other'},
                ]
            }
        }),
        defineField({
            name: "location",
            title: "Residential Area Type",
            type: "string",
            options: {
                list: [
                    {title: 'Rural', value: 'rural'},
                    {title: 'Urban', value: 'urban'},
                ]
            }
        }),
    ],
    preview: {
        select: {
            title: "name",
        },
    },
})