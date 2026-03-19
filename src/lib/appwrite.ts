import { Client, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID');

export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'YOUR_DATABASE_ID',
    collections: {
        artworks: import.meta.env.VITE_APPWRITE_COLLECTION_ARTWORKS_ID || 'YOUR_COLLECTION_ID'
    },
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID || 'YOUR_BUCKET_ID'
};

export function useAppwrite() {
    return {
        client,
        databases,
        storage,
        ID,
        Query,
        config: APPWRITE_CONFIG
    };
}
