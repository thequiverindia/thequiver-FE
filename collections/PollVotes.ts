import type { CollectionConfig } from 'payload';
import { adminOnly } from './access';

/** One vote per reader per poll — enforced by a unique compound index. */
export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',
  admin: {
    group: 'Engagement',
    defaultColumns: ['poll', 'reader', 'optionId', 'createdAt'],
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  indexes: [{ fields: ['reader', 'poll'], unique: true }],
  fields: [
    { name: 'poll', type: 'relationship', relationTo: 'polls', required: true, index: true },
    { name: 'reader', type: 'relationship', relationTo: 'readers', required: true, index: true },
    { name: 'optionId', type: 'text', required: true },
  ],
};
