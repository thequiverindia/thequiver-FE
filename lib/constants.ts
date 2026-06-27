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
  { label: 'Live', href: '/live' },
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
    title: 'Watch & Listen',
    links: [
      { label: 'Videos', href: '/videos' },
      { label: 'Podcasts', href: '/podcasts' },
      { label: 'Live Updates', href: '/live' },
      { label: 'Polls', href: '/polls' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
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
];

export const PARTY_COLORS: Record<string, string> = {
  BJP: '#FF9933',
  INC: '#00BFFF',
  AAP: '#0072CE',
  TMC: '#15803D',
  DMK: '#DC2626',
  ADMK: '#16A34A',
  BRS: '#EC4899',
  SP: '#DC2626',
  BSP: '#3B82F6',
  JDU: '#16A34A',
  RJD: '#16A34A',
  SS: '#F97316',
  NCP: '#0E7490',
  CPI: '#DC2626',
  CPIM: '#B91C1C',
  YSRCP: '#0EA5E9',
  TDP: '#FBBF24',
  IND: '#737373',
};
