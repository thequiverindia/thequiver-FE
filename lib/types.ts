/**
 * Frontend view models.
 *
 * Pages and components consume these shapes; lib/data maps Payload
 * documents into them. Keeping the view layer on its own types means
 * component code never depends on CMS internals.
 */

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

export type Language = 'en' | 'hi';

export interface Author {
  id: string;
  name: string;
  slug?: string;
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
  category: string;
  categoryLabel?: string;
  tags: string[];
  image: string;
  imageCaption?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  verification: Verification;
  sourceCount: number;
  factCheckSlug?: string;
  isExclusive?: boolean;
  views: number;
  language: Language;
  /** Lexical editor state — rendered by components/article/ArticleBody. */
  body?: unknown;
  /** Editor-picked related stories (populated on detail fetches). */
  related?: Article[];
  /** The same story in the other language, if a translation is linked. */
  translationOf?: { slug: string; language: Language } | null;
}

export type PromiseStatus = 'kept' | 'broken' | 'in-progress' | 'unverifiable';

export interface PoliticianPromise {
  id: string;
  text: string;
  status: PromiseStatus;
  madeOn: string;
  context?: string;
  sourceUrl?: string;
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
  language: Language;
}

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  views: number;
  publishedAt: string;
  series?: string;
  host: string;
}

export interface Poll {
  id: string;
  slug: string;
  question: string;
  description?: string;
  options: { id: string; label: string; votes: number; color?: string }[];
  totalVotes: number;
  endsAt: string;
  category: string;
  state?: string;
}
