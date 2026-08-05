import type { CollectionConfig } from 'payload';

/**
 * Editorial staff accounts (admin panel access).
 * Readers get their own auth system later (Auth.js) — these are the
 * people who write and publish.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    // Only admins manage staff accounts; everyone can read their own profile.
    admin: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      access: {
        // Only admins may change roles.
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
};
