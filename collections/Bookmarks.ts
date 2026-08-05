import type { CollectionConfig } from 'payload';
import { adminOnly } from './access';

/** A reader saving an article. One row per reader+article pair. */
export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  admin: {
    group: 'Engagement',
    defaultColumns: ['reader', 'article', 'createdAt'],
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  indexes: [{ fields: ['reader', 'article'], unique: true }],
  fields: [
    { name: 'reader', type: 'relationship', relationTo: 'readers', required: true, index: true },
    { name: 'article', type: 'relationship', relationTo: 'articles', required: true, index: true },
  ],
};
