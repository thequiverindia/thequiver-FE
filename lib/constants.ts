import type { Category } from './types';

export const CATEGORIES: { slug: Category; label: string; description: string }[] = [
  { slug: 'politics', label: 'Politics', description: 'Power, policy and the politics of nation-building.' },
  { slug: 'elections', label: 'Elections', description: 'Live results, constituency data and seat-by-seat analysis.' },
  { slug: 'opinion', label: 'Opinion', description: 'Sharp commentary from columnists across the spectrum.' },
  { slug: 'explainers', label: 'Explainers', description: 'The story behind the headlines, in plain language.' },
  { slug: 'fact-check', label: 'Fact Check', description: 'Verified claims, rated and sourced.' },
  { slug: 'state-news', label: 'State News', description: 'Stories from every corner of India.' },
  { slug: 'international', label: 'International', description: 'India in the world, the world in India.' },
  { slug: 'trending', label: 'Trending', description: 'What India is reading right now.' },
  { slug: 'videos', label: 'Videos', description: 'Watch the news. Documentaries, interviews, explainers.' },
  { slug: 'podcasts', label: 'Podcasts', description: 'Listen on the go. Daily briefs, deep dives.' },
];

export const PRIMARY_NAV = [
  { label: 'Politics', href: '/politics' },
  { label: 'Elections', href: '/elections' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Explainers', href: '/explainers' },
  { label: 'Fact Check', href: '/fact-check' },
  { label: 'Leaders', href: '/leader' },
  { label: 'Videos', href: '/videos' },
  { label: 'State News', href: '/state-news' },
];

export const FOOTER_LINKS = [
  {
    title: 'Sections',
    links: [
      { label: 'Politics', href: '/politics' },
      { label: 'Elections', href: '/elections' },
      { label: 'Opinion', href: '/opinion' },
      { label: 'Explainers', href: '/explainers' },
      { label: 'Fact Check', href: '/fact-check' },
      { label: 'State News', href: '/state-news' },
      { label: 'International', href: '/international' },
      { label: 'Trending', href: '/trending' },
    ],
  },
  {
    title: 'Watch & Engage',
    links: [
      { label: 'Videos', href: '/videos' },
      { label: 'Polls', href: '/polls' },
      { label: 'Leader Index', href: '/leader' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Advertise', href: '/advertise' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Editorial Code', href: '/about#code' },
      { label: 'Fact-Check Policy', href: '/about#fact-check' },
    ],
  },
];

export const STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Karnataka',
  'West Bengal',
  'Gujarat',
  'Bihar',
  'Madhya Pradesh',
  'Rajasthan',
  'Telangana',
  'Delhi',
  'Kerala',
  'Punjab',
  'Haryana',
  'Odisha',
  'Andhra Pradesh',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
] as const;

