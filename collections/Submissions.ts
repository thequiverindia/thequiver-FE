import type { CollectionConfig } from 'payload';
import { adminOnly, adminOrEditor } from './access';

/**
 * Everything readers send us through a form.
 *
 * Previously /contact, the fact-check "submit a claim" CTA and the advertise
 * enquiry form all called preventDefault() and threw the message away. They
 * now land here, in one moderated inbox, so nothing a reader writes is lost.
 *
 * Writes go exclusively through /api/submissions (rate-limited + honeypot);
 * the collection itself is closed to the public.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'kind', 'status', 'createdAt'],
    group: 'Engagement',
    description: 'Reader messages: contact, claims to fact-check, ad enquiries.',
  },
  access: {
    read: adminOrEditor,
    create: adminOnly, // the API route creates these with overrideAccess
    update: adminOrEditor,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Contact message', value: 'contact' },
        { label: 'Claim to fact-check', value: 'claim' },
        { label: 'Advertising enquiry', value: 'advertising' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      admin: { readOnly: true, description: 'Auto-generated preview for the list view' },
    },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: { description: 'Where the reader saw the claim (fact-check submissions)' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes — never shown to the reader' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const text: string = data.subject || data.message || '';
        data.summary = text.slice(0, 80) + (text.length > 80 ? '…' : '');
        return data;
      },
    ],
  },
};
