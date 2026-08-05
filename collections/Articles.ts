import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';
import { anyone, staffOnly, adminOrEditor, publishedOrStaff } from './access';
import { slugField } from './fields/slugField';
import { revalidateAfterChange, revalidateAfterDelete } from './hooks/revalidate';

/** Walk a Lexical tree collecting plain text, to estimate read time. */
function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { text?: string; children?: unknown[] };
  const own = typeof n.text === 'string' ? n.text : '';
  const kids = Array.isArray(n.children) ? n.children.map(extractText).join(' ') : '';
  return `${own} ${kids}`;
}

const computeReadingStats: CollectionBeforeChangeHook = ({ data }) => {
  const root = (data?.body as { root?: unknown } | undefined)?.root;
  if (root) {
    const words = extractText(root).split(/\s+/).filter(Boolean).length;
    data.wordCount = words;
    data.readMinutes = Math.max(1, Math.round(words / 200));
  }
  return data;
};

/** Authors may write and save drafts, but only editors/admins publish. */
const blockAuthorPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user?.role === 'author' && data?._status === 'published') {
    throw new Error('Authors can save drafts — an editor or admin must publish.');
  }
  return data;
};

const setCreatedBy: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === 'create' && req.user) {
    data.createdBy = req.user.id;
  }
  return data;
};

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'language', 'category', 'author', '_status', 'publishedAt'],
    group: 'Editorial',
  },
  versions: {
    drafts: {
      autosave: { interval: 3000 },
    },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role !== 'author') return true;
      // Authors may only edit what they created.
      return { createdBy: { equals: req.user.id } };
    },
    delete: adminOrEditor,
  },
  hooks: {
    beforeChange: [setCreatedBy, blockAuthorPublish, computeReadingStats],
    afterChange: [revalidateAfterChange('articles')],
    afterDelete: [revalidateAfterDelete('articles')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
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
    { name: 'kicker', type: 'text', admin: { description: 'Small label above the headline, e.g. "Parliament"' } },
    { name: 'excerpt', type: 'textarea', required: true, admin: { description: 'One-paragraph summary — shown on cards and in search results' } },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main image — alt text is set on the media itself' },
    },
    { name: 'imageCaption', type: 'text' },
    { name: 'body', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'relationship', relationTo: 'categories', required: true, admin: { width: '50%' } },
        { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true, admin: { width: '50%' } },
      ],
    },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'verification',
          type: 'select',
          defaultValue: 'sourced',
          options: [
            { label: 'Verified', value: 'verified' },
            { label: 'Sourced', value: 'sourced' },
            { label: 'Developing', value: 'developing' },
          ],
          admin: { width: '50%' },
        },
        { name: 'sourceCount', type: 'number', defaultValue: 1, admin: { width: '50%', description: 'How many independent sources back this story' } },
      ],
    },
    {
      name: 'factCheck',
      type: 'relationship',
      relationTo: 'fact-checks',
      admin: { description: 'Linked fact-check, if this story includes a verified claim' },
    },
    {
      name: 'mentionedLeaders',
      type: 'relationship',
      relationTo: 'leaders',
      hasMany: true,
      admin: { description: 'Powers "In the news" on leader profiles and related-content matching' },
    },
    {
      name: 'mentionedParties',
      type: 'relationship',
      relationTo: 'parties',
      hasMany: true,
    },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      admin: { description: 'Hand-picked related stories (overrides automatic matching)' },
    },
    {
      name: 'translationOf',
      type: 'relationship',
      relationTo: 'articles',
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      admin: {
        position: 'sidebar',
        description: 'If this is a translation, link the original article',
      },
    },
    { name: 'isExclusive', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            // Stamp first-publish time automatically.
            siblingData?._status === 'published' && !value ? new Date().toISOString() : value,
        ],
      },
    },
    { name: 'views', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'readMinutes', type: 'number', admin: { position: 'sidebar', readOnly: true, description: 'Computed from body length' } },
    { name: 'wordCount', type: 'number', admin: { hidden: true } },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
  ],
};
