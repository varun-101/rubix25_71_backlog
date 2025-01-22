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
    ],
    preview: {
        select: {
            title: "name",
        },
    },
})