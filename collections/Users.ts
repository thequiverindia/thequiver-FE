import type { CollectionConfig } from 'payload';

/**
 * Editorial staff accounts (admin panel access).
 * Readers get their own auth system (Auth.js) — these are the people who
 * write and publish.
 *
 * SECURITY: every operation must be listed explicitly. Payload's defaults are
 * `Boolean(user)`, so omitting `create`/`update`/`delete` would let ANY staff
 * account (including a low-privilege author) create an admin or take over
 * another account through the public REST/GraphQL API.
 */
const isAdmin = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === 'admin';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    // Anyone with a staff login may open the panel; what they can *do*
    // inside it is governed per-collection.
    admin: ({ req }) => Boolean(req.user),
    // Admins manage the roster; everyone else may only see/edit themselves.
    read: ({ req }) => (isAdmin({ req }) ? true : { id: { equals: req.user?.id } }),
    create: isAdmin,
    update: ({ req }) => (isAdmin({ req }) ? true : { id: { equals: req.user?.id } }),
    delete: isAdmin,
    unlock: isAdmin,
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
        // Only admins may set or change roles — on create as well as update,
        // otherwise a self-signup path could mint an admin.
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
};
