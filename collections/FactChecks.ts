import type { CollectionConfig } from 'payload';
import { staffOnly, adminOrEditor, publishedOrStaff } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

export const FactChecks: CollectionConfig = {
  slug: 'fact-checks',
  admin: {
    useAsTitle: 'claim',
    defaultColumns: ['claim', 'rating', 'claimant', '_status', 'publishedAt'],
    group: 'Editorial',
  },
  versions: {
    drafts: { autosave: { interval: 3000 } },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('fact-checks')],
    afterDelete: [revalidateAfterDelete('fact-checks')],
  },
  fields: [
    { name: 'claim', type: 'textarea', required: true, admin: { description: 'The claim being checked, quoted as it circulated' } },
    slugField('claim'),
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'हिन्दी', value: 'hi' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'claimant', type: 'text', required: true, admin: { description: 'Who made the claim' } },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: 'True', value: 'true' },
        { label: 'Mostly True', value: 'mostly-true' },
        { label: 'Misleading', value: 'misleading' },
        { label: 'False', value: 'false' },
        { label: 'Satire', value: 'satire' },
      ],
    },
    { name: 'verdict', type: 'textarea', required: true, admin: { description: 'Plain-language verdict paragraph' } },
    {
      name: 'evidence',
      type: 'array',
      labels: { singular: 'Evidence point', plural: 'Evidence' },
      fields: [{ name: 'point', type: 'textarea', required: true }],
    },
    {
      name: 'sources',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'The viral image/screenshot under review' } },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            siblingData?._status === 'published' && !value ? new Date().toISOString() : value,
        ],
      },
    },
    { name: 'views', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
  ],
};
