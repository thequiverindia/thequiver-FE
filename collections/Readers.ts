import type { CollectionConfig } from 'payload';
import { adminOnly, adminOrEditor } from './access';

/**
 * Site reader accounts (Google sign-in via Auth.js). Separate from Users
 * (editorial staff) — readers never see the admin panel. Rows are created
 * automatically on first sign-in.
 */
export const Readers: CollectionConfig = {
  slug: 'readers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
    group: 'Engagement',
    description: 'Created automatically when someone signs in with Google.',
  },
  access: {
    read: adminOrEditor,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    { name: 'avatarUrl', type: 'text' },
  ],
};
