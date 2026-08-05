import type { CollectionConfig } from 'payload';
import { anyone, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

/**
 * Public byline profiles (distinct from Users, which are login accounts).
 * Keeping them separate means a byline can exist for a freelancer or a
 * departed writer without giving anyone panel access.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    group: 'Editorial',
  },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('authors')],
    afterDelete: [revalidateAfterDelete('authors')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'handle', type: 'text', admin: { description: 'e.g. @ananya' } },
    { name: 'role', type: 'text', admin: { description: 'e.g. Political Editor' } },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
};
