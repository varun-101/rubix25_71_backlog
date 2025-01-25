import { defineType, defineField } from "sanity";

export const application = defineType({
    name: "application",
    title: "Application",
    type: "document",
    fields: [
        {
            name: 'listing',
            title: 'Listing',
            type: 'reference',
            to: [{ type: 'listing' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'applicant',
            title: 'Applicant',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Approved', value: 'approved' },
                    { title: 'Rejected', value: 'rejected' }
                ]
            },
            initialValue: 'pending'
        },
        {
            name: 'message',
            title: 'Message',
            type: 'text'
        }
    ]
})