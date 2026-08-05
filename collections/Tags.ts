import type { CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor } from './access';
import { slugField } from './fields/slugField';

/**
 * Tags are shared across languages: one slug (e.g. "gst"), bilingual labels.
 * This single discipline makes related-content matching work across
 * English and Hindi articles.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'labelHi', 'slug'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'labelHi', type: 'text', label: 'Label (Hindi)' },
    slugField('label'),
  ],
};
