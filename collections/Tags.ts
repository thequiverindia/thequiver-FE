import type { CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

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
  hooks: {
    // Tag labels are copied into the articles cache — renaming one must bust it.
    afterChange: [revalidateAfterChange('tags', { alsoBust: ['articles'] })],
    afterDelete: [revalidateAfterDelete('tags', { alsoBust: ['articles'] })],
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'labelHi', type: 'text', label: 'Label (Hindi)' },
    slugField('label'),
  ],
};
