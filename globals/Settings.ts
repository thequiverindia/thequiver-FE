import type { GlobalConfig } from 'payload';
import { anyone, adminOnly } from '../collections/access';
import { revalidateGlobal } from '../collections/hooks/revalidate';

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: anyone,
    update: adminOnly,
  },
  hooks: {
    // Without this, edits to the site name/handles never reach the footer
    // (unstable_cache defaults to a one-year TTL).
    afterChange: [revalidateGlobal('settings')],
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'TheQuiverIndia' },
    { name: 'tagline', type: 'text', defaultValue: 'Politics. Power. People.' },
    {
      name: 'socials',
      type: 'group',
      admin: { description: 'Real handles — these feed the footer and share links' },
      fields: [
        { name: 'instagram', type: 'text', admin: { description: 'handle only, no @' } },
        { name: 'youtube', type: 'text', admin: { description: 'channel handle, e.g. @thequiverindia' } },
        { name: 'youtubeChannelId', type: 'text', admin: { description: 'UC… id — needed for the video auto-sync feed' } },
        { name: 'x', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
  ],
};
