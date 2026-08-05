import type { StateResult, ConstituencyResult } from './types';

export const ELECTION_RESULTS_2024: StateResult[] = [
  {
    state: 'Maharashtra',
    totalSeats: 48,
    leading: 'Mahayuti',
    results: [
      { party: 'BJVP', partyColor: '#1E40AF', seats: 21, vote_share: 27.4 },
      { party: 'SS', partyColor: '#F97316', seats: 12, vote_share: 18.2 },
      { party: 'JSM', partyColor: '#DC2626', seats: 9, vote_share: 16.1 },
      { party: 'NCP', partyColor: '#0E7490', seats: 4, vote_share: 9.8 },
      { party: 'IND', partyColor: '#737373', seats: 2, vote_share: 28.5 },
    ],
  },
  {
    state: 'Uttar Pradesh',
    totalSeats: 80,
    leading: 'BJVP+',
    results: [
      { party: 'BJVP', partyColor: '#1E40AF', seats: 41, vote_share: 36.4 },
      { party: 'JSM', partyColor: '#DC2626', seats: 27, vote_share: 28.3 },
      { party: 'BSP', partyColor: '#3B82F6', seats: 0, vote_share: 8.7 },
      { party: 'INC', partyColor: '#00BFFF', seats: 8, vote_share: 16.9 },
      { party: 'IND', partyColor: '#737373', seats: 4, vote_share: 9.7 },
    ],
  },
  {
    state: 'Tamil Nadu',
    totalSeats: 39,
    leading: 'JSM+',
    results: [
      { party: 'JSM', partyColor: '#DC2626', seats: 22, vote_share: 38.1 },
      { party: 'ADMK', partyColor: '#16A34A', seats: 11, vote_share: 27.3 },
      { party: 'BJVP', partyColor: '#1E40AF', seats: 3, vote_share: 12.4 },
      { party: 'INC', partyColor: '#00BFFF', seats: 3, vote_share: 18.2 },
    ],
  },
  {
    state: 'West Bengal',
    totalSeats: 42,
    leading: 'BPF',
    results: [
      { party: 'BPF', partyColor: '#15803D', seats: 29, vote_share: 45.6 },
      { party: 'BJVP', partyColor: '#1E40AF', seats: 12, vote_share: 38.2 },
      { party: 'INC', partyColor: '#00BFFF', seats: 1, vote_share: 9.4 },
    ],
  },
  {
    state: 'Karnataka',
    totalSeats: 28,
    leading: 'INC+',
    results: [
      { party: 'INC', partyColor: '#00BFFF', seats: 9, vote_share: 45.4 },
      { party: 'BJVP', partyColor: '#1E40AF', seats: 17, vote_share: 41.2 },
      { party: 'JDS', partyColor: '#10B981', seats: 2, vote_share: 6.1 },
    ],
  },
  {
    state: 'Gujarat',
    totalSeats: 26,
    leading: 'BJVP',
    results: [
      { party: 'BJVP', partyColor: '#1E40AF', seats: 25, vote_share: 60.1 },
      { party: 'INC', partyColor: '#00BFFF', seats: 1, vote_share: 32.4 },
    ],
  },
  {
    state: 'Bihar',
    totalSeats: 40,
    leading: 'NDA',
    results: [
      { party: 'BJVP', partyColor: '#1E40AF', seats: 17, vote_share: 25.4 },
      { party: 'JDU', partyColor: '#16A34A', seats: 12, vote_share: 22.1 },
      { party: 'RJD', partyColor: '#15803D', seats: 7, vote_share: 23.8 },
      { party: 'INC', partyColor: '#00BFFF', seats: 4, vote_share: 11.2 },
    ],
  },
  {
    state: 'Rajasthan',
    totalSeats: 25,
    leading: 'BJVP',
    results: [
      { party: 'BJVP', partyColor: '#1E40AF', seats: 14, vote_share: 49.4 },
      { party: 'INC', partyColor: '#00BFFF', seats: 8, vote_share: 41.2 },
      { party: 'IND', partyColor: '#737373', seats: 3, vote_share: 9.4 },
    ],
  },
];

export const CONSTITUENCY_RESULTS: ConstituencyResult[] = [
  { name: 'Pune North', state: 'Maharashtra', winner: 'Arjun Deshmukh', party: 'BJVP', partyColor: '#1E40AF', margin: 112_400, votes: 624_300 },
  { name: 'Chennai South', state: 'Tamil Nadu', winner: 'Priya Raghavan', party: 'JSM', partyColor: '#DC2626', margin: 64_300, votes: 487_100 },
  { name: 'Howrah', state: 'West Bengal', winner: 'Rajiv Banerjee', party: 'BPF', partyColor: '#15803D', margin: 89_700, votes: 521_400 },
  { name: 'Lucknow', state: 'Uttar Pradesh', winner: 'Meera Vajpayee', party: 'BJVP', partyColor: '#1E40AF', margin: 142_300, votes: 698_500 },
  { name: 'New Delhi', state: 'Delhi', winner: 'Devika Sharma', party: 'AAM', partyColor: '#0EA5E9', margin: 14_200, votes: 312_800 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', winner: 'Venkatesh Rao', party: 'TDS', partyColor: '#FBBF24', margin: 76_800, votes: 542_900 },
  { name: 'Amritsar', state: 'Punjab', winner: 'Simran Kaur', party: 'PLF', partyColor: '#15803D', margin: 31_200, votes: 412_700 },
  { name: 'Hyderabad Old City', state: 'Telangana', winner: 'Farhan Khan', party: 'JSM', partyColor: '#DC2626', margin: 28_400, votes: 287_300 },
];


export function findStateResult(state: string) {
  return ELECTION_RESULTS_2024.find(
    (r) => r.state.toLowerCase().replace(/\s+/g, '-') === state.toLowerCase(),
  );
}
