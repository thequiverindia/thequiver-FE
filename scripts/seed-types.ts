export type Category =
  | 'politics'
  | 'elections'
  | 'opinion'
  | 'explainers'
  | 'fact-check'
  | 'state-news'
  | 'international'
  | 'trending'
  | 'videos'
  | 'podcasts';

export type Verification = 'verified' | 'sourced' | 'developing';

export type ArticleFormat = 'article' | 'video' | 'podcast' | 'photo-essay' | 'live';

export interface Author {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  kicker?: string;
  excerpt: string;
  category: Category;
  tags: string[];
  image: string;
  imageCaption?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  wordCount: number;
  verification: Verification;
  sourceCount: number;
  factCheckId?: string;
  format: ArticleFormat;
  isBreaking?: boolean;
  isExclusive?: boolean;
  isSponsored?: boolean;
  views: number;
  body: ArticleBlock[];
  relatedIds?: string[];
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'image'; src: string; caption?: string; credit?: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'note'; text: string }
  | { type: 'stat'; label: string; value: string; sub?: string };

export type PromiseStatus = 'kept' | 'broken' | 'in-progress' | 'unverifiable';

export interface PoliticianPromise {
  id: string;
  text: string;
  status: PromiseStatus;
  madeOn: string;
  context?: string;
}

export interface PoliticianEvent {
  date: string;
  title: string;
  description: string;
  kind: 'milestone' | 'controversy' | 'election' | 'statement';
}

export interface Politician {
  id: string;
  slug: string;
  name: string;
  party: string;
  partyShort: string;
  partyColor: string;
  constituency: string;
  state: string;
  position: string;
  age: number;
  bio: string;
  image: string;
  rating: number;
  followers: number;
  promises: PoliticianPromise[];
  timeline: PoliticianEvent[];
  socials: { twitter?: string; instagram?: string; facebook?: string; web?: string };
  net_worth?: string;
  education?: string;
  criminalCases?: number;
  attendance?: number;
  questionsAsked?: number;
}

export interface Party {
  id: string;
  slug: string;
  name: string;
  short: string;
  color: string;
  founded: number;
  ideology: string[];
  leader: string;
  seats: number;
}

export interface ConstituencyResult {
  name: string;
  state: string;
  winner: string;
  party: string;
  partyColor: string;
  margin: number;
  votes: number;
}

export interface StateResult {
  state: string;
  totalSeats: number;
  results: { party: string; partyColor: string; seats: number; vote_share: number }[];
  leading: string;
}

export interface FactCheck {
  id: string;
  slug: string;
  claim: string;
  claimant: string;
  rating: 'true' | 'mostly-true' | 'misleading' | 'false' | 'satire';
  verdict: string;
  evidence: string[];
  sources: { label: string; url: string }[];
  author: Author;
  publishedAt: string;
  image: string;
  views: number;
}

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: Category;
  views: number;
  publishedAt: string;
  series?: string;
  host: string;
}

export interface Podcast {
  id: string;
  slug: string;
  title: string;
  series: string;
  description: string;
  artwork: string;
  duration: string;
  host: string;
  episode: number;
  publishedAt: string;
  plays: number;
}

export interface Poll {
  id: string;
  slug: string;
  question: string;
  description?: string;
  options: { id: string; label: string; votes: number; color?: string }[];
  totalVotes: number;
  endsAt: string;
  category: Category;
  state?: string;
}

export interface LiveUpdate {
  id: string;
  time: string;
  text: string;
  tag: 'breaking' | 'parliament' | 'election' | 'statement' | 'developing';
  location?: string;
}
