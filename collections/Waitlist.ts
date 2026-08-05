import type { CollectionConfig } from 'payload';
import { adminOnly, adminOrEditor } from './access';

/**
 * Newsletter waitlist — STORE-ONLY by design. No email is ever sent in v1;
 * these addresses wait for the future email milestone.
 */
export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Engagement',
    description: 'Newsletter interest list. Nothing is sent to these addresses yet.',
  },
  access: {
    read: adminOrEditor,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'source', type: 'text', admin: { description: 'Which form captured it (footer, cta, newsletter page)' } },
  ],
};
