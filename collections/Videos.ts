import type { CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

/**
 * Videos play via YouTube embeds — no hosting cost, views count on the
 * channel. The daily sync job (Milestone 4) fills these automatically
 * from the channel feed; editors can also add/curate manually.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'series', 'source', 'publishedAt'],
    group: 'Editorial',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: staffOnly,
    delete: adminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange('videos')],
    afterDelete: [revalidateAfterDelete('videos')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'youtubeId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'The 11-character YouTube video ID (from the URL)' },
    },
    { name: 'description', type: 'textarea' },
    { name: 'thumbnailUrl', type: 'text', admin: { description: 'Auto-filled from YouTube; override if needed' } },
    { name: 'duration', type: 'text', admin: { description: 'e.g. 12:45' } },
    { name: 'series', type: 'text' },
    { name: 'host', type: 'text' },
    {
      name: 'relatedArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: { description: '"Watch the video report" cross-link' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Added manually', value: 'manual' },
        { label: 'Synced from YouTube', value: 'youtube' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'views', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
};
