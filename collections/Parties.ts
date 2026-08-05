import type { CollectionConfig } from 'payload';
import { anyone, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

export const Parties: CollectionConfig = {
  slug: 'parties',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'short', 'seats'],
    group: 'Politics',
  },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('parties')],
    afterDelete: [revalidateAfterDelete('parties')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'short', type: 'text', required: true, admin: { description: 'Abbreviation, e.g. BJVP' } },
    slugField('name'),
    {
      name: 'color',
      type: 'text',
      required: true,
      defaultValue: '#737373',
      admin: {
        description:
          'Party brand color (hex). Used only for dots/bars, never as text color.',
      },
      validate: (val: string | null | undefined) =>
        !val || /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)
          ? true
          : 'Must be a hex color like #FF9933',
    },
    { name: 'founded', type: 'number' },
    { name: 'ideology', type: 'text', hasMany: true },
    { name: 'leader', type: 'text' },
    { name: 'seats', type: 'number', defaultValue: 0, admin: { description: 'Current Lok Sabha seats' } },
  ],
};
