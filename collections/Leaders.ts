import type { CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';
import { STATES } from '../lib/constants';

export const Leaders: CollectionConfig = {
  slug: 'leaders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'party', 'constituency', 'state', 'rating'],
    group: 'Politics',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('leaders', { draftsMatter: true })],
    afterDelete: [revalidateAfterDelete('leaders')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'party', type: 'relationship', relationTo: 'parties', required: true },
    { name: 'position', type: 'text', admin: { description: 'e.g. Member of Parliament' } },
    { name: 'constituency', type: 'text' },
    {
      name: 'state',
      type: 'select',
      options: STATES.map((s) => ({ label: s, value: s })),
    },
    { name: 'age', type: 'number' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', min: 0, max: 10, admin: { width: '25%' } },
        { name: 'followers', type: 'number', defaultValue: 0, admin: { width: '25%' } },
        { name: 'attendance', type: 'number', min: 0, max: 100, admin: { width: '25%', description: '% in house' } },
        { name: 'questionsAsked', type: 'number', admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'netWorth', type: 'text', admin: { width: '33%', description: 'e.g. ₹12.4 Cr (from affidavit)' } },
        { name: 'criminalCases', type: 'number', defaultValue: 0, admin: { width: '33%' } },
        { name: 'education', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text', admin: { description: 'handle only, no @' } },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'web', type: 'text' },
      ],
    },
    {
      name: 'promises',
      type: 'array',
      labels: { singular: 'Promise', plural: 'Promises' },
      fields: [
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'unverifiable',
          options: [
            { label: 'Kept', value: 'kept' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Broken', value: 'broken' },
            { label: 'Unverifiable', value: 'unverifiable' },
          ],
        },
        { name: 'madeOn', type: 'date' },
        { name: 'context', type: 'text' },
        {
          name: 'sourceUrl',
          type: 'text',
          admin: { description: 'Link to the record backing this status — accountability needs receipts' },
        },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      labels: { singular: 'Event', plural: 'Timeline' },
      fields: [
        { name: 'date', type: 'date', required: true },
        {
          name: 'kind',
          type: 'select',
          required: true,
          options: [
            { label: 'Milestone', value: 'milestone' },
            { label: 'Election', value: 'election' },
            { label: 'Controversy', value: 'controversy' },
            { label: 'Statement', value: 'statement' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
};
