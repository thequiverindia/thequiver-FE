import type { CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';
import { STATES } from '../lib/constants';

/**
 * Reader polls. Option vote counts live here; per-user vote records
 * (one vote per reader) arrive with the engagement milestone.
 */
export const Polls: CollectionConfig = {
  slug: 'polls',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'totalVotes', 'endsAt'],
    group: 'Engagement',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('polls', { draftsMatter: true })],
    afterDelete: [revalidateAfterDelete('polls')],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    slugField('question'),
    { name: 'description', type: 'textarea' },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'politics',
      options: [
        { label: 'Politics', value: 'politics' },
        { label: 'Elections', value: 'elections' },
        { label: 'Opinion', value: 'opinion' },
        { label: 'Trending', value: 'trending' },
      ],
    },
    {
      name: 'state',
      type: 'select',
      options: STATES.map((s) => ({ label: s, value: s })),
      admin: { description: 'Optional — for state-specific polls' },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'votes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
        { name: 'color', type: 'text', admin: { description: 'Optional hex; defaults to brand color' } },
      ],
    },
    { name: 'totalVotes', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'endsAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
};
