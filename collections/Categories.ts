import type { CollectionConfig } from 'payload';
import { anyone, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('categories', { alsoBust: ['articles'] })],
    afterDelete: [revalidateAfterDelete('categories', { alsoBust: ['articles'] })],
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'labelHi',
      type: 'text',
      label: 'Label (Hindi)',
      admin: { description: 'Shown to Hindi readers — same category, bilingual label' },
    },
    slugField('label'),
    { name: 'description', type: 'textarea' },
  ],
};
