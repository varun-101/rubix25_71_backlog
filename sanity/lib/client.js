import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Set to false for mutations
    token, // Required for write operations
    ignoreBrowserTokenWarning: true
})

// Separate read-only client for queries
export const readOnlyClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published'
})
