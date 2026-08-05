import type { CollectionConfig } from 'payload';
import { adminOrEditor } from './access';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

/**
 * Reader comments. Everything lands as `pending`; editors approve from the
 * admin panel (the moderation queue). Only approved comments are public.
 */
export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'body',
    defaultColumns: ['body', 'article', 'reader', 'status', 'createdAt'],
    group: 'Engagement',
    description: 'Moderation queue — approve or reject pending comments.',
  },
  access: {
    // Public API responses only ever expose approved comments.
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: 'approved' } };
    },
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('comments')],
    afterDelete: [revalidateAfterDelete('comments')],
  },
  fields: [
    { name: 'body', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'article', type: 'relationship', relationTo: 'articles', required: true, index: true },
    { name: 'reader', type: 'relationship', relationTo: 'readers', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
};
