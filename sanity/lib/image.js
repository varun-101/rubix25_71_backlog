import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder(client)

export const urlFor = (source) => {
  if (!source) return null
  return builder.image(source).auto('format')
}

export const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
        const asset = await client.assets.upload('image', file, {
            contentType: file.type,
            filename: file.name
        });
        
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id
            }
        };
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
    }
};

export const uploadImages = async (files) => {
    try {
        const uploads = await Promise.all(
            files.map(file => uploadImage(file))
        );
        return uploads.filter(Boolean); // Remove any failed uploads
    } catch (error) {
        console.error('Images upload error:', error);
        throw new Error('Failed to upload images');
    }
};
