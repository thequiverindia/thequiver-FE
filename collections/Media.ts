import type { CollectionConfig } from 'payload';

/**
 * All uploaded images (article heroes, leader photos, fact-check evidence).
 * Stored on local disk in dev; swaps to Cloudflare R2 via a storage adapter
 * for staging/production without changing this collection.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 320 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers and SEO — what does it show?',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer / agency credit (optional)' },
    },
  ],
};
