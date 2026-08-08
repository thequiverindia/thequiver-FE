import type { CollectionConfig } from 'payload';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

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
  hooks: {
    // Image URLs are embedded in the article/fact-check/leader caches, so
    // replacing a file must bust them or the old image sticks for a year.
    afterChange: [
      revalidateAfterChange('media', {
        alsoBust: ['articles', 'fact-checks', 'leaders', 'authors'],
      }),
    ],
    afterDelete: [
      revalidateAfterDelete('media', {
        alsoBust: ['articles', 'fact-checks', 'leaders', 'authors'],
      }),
    ],
  },
  upload: {
    staticDir: 'media',
    // SVG is deliberately excluded: it can carry scripts, and next/image
    // rejects it anyway (that combination is what broke every avatar).
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
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
