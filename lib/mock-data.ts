import type {
  Article,
  Author,
  ConstituencyResult,
  FactCheck,
  LiveUpdate,
  Party,
  Podcast,
  Politician,
  Poll,
  StateResult,
  Video,
} from './types';

const img = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const avatar = (name: string) =>
  `https://avatar.vercel.sh/${encodeURIComponent(name)}.svg?text=${encodeURIComponent(
    name.split(' ').map((p) => p[0]).join(''),
  )}`;

export const AUTHORS: Author[] = [
  {
    id: 'a1',
    name: 'Ananya Mehra',
    handle: 'ananyam',
    role: 'Political Editor',
    bio: 'Covering Parliament, parties and the politics of policy for over a decade.',
    avatar: avatar('Ananya Mehra'),
  },
  {
    id: 'a2',
    name: 'Rohan Khurana',
    handle: 'rohank',
    role: 'Senior Correspondent, North India',
    bio: 'Reports from Uttar Pradesh, Bihar and the Hindi heartland.',
    avatar: avatar('Rohan Khurana'),
  },
  {
    id: 'a3',
    name: 'Lakshmi Iyer',
    handle: 'lakshmiiyer',
    role: 'South India Bureau Chief',
    bio: 'Tracks politics from Chennai to Thiruvananthapuram.',
    avatar: avatar('Lakshmi Iyer'),
  },
  {
    id: 'a4',
    name: 'Tariq Ahmed',
    handle: 'tariqahmed',
    role: 'Fact-Check Lead',
    bio: 'Verifies claims, viral videos and political misinformation.',
    avatar: avatar('Tariq Ahmed'),
  },
  {
    id: 'a5',
    name: 'Prerna Singh',
    handle: 'prernas',
    role: 'Data Journalist',
    bio: 'Numbers, charts and the stories hidden inside spreadsheets.',
    avatar: avatar('Prerna Singh'),
  },
  {
    id: 'a6',
    name: 'Devraj Pillai',
    handle: 'devrajp',
    role: 'Opinion Columnist',
    bio: 'Constitutional law, federalism and the long view.',
    avatar: avatar('Devraj Pillai'),
  },
  {
    id: 'a7',
    name: 'Sneha Banerjee',
    handle: 'snehab',
    role: 'East India Correspondent',
    bio: 'Reports from Bengal, Odisha and the Northeast.',
    avatar: avatar('Sneha Banerjee'),
  },
  {
    id: 'a8',
    name: 'Karan Joshi',
    handle: 'karanj',
    role: 'Video Anchor',
    bio: 'Hosts the daily 8 PM debate and explainer series.',
    avatar: avatar('Karan Joshi'),
  },
];

const A = (idx: number) => AUTHORS[idx];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'parliament-monsoon-session-key-bills-2026',
    title:
      'Inside the Monsoon Session: The seven bills that will shape India\'s next decade',
    kicker: 'Parliament Watch',
    excerpt:
      'From a sweeping data protection overhaul to a controversial electoral funding bill, here is what the government plans to push through — and the opposition\'s sharpest pushback.',
    category: 'politics',
    tags: ['Parliament', 'Lok Sabha', 'Policy', 'Monsoon Session'],
    image: img('parliament-1'),
    imageCaption: 'The Parliament House complex on the eve of the Monsoon Session.',
    author: A(0),
    publishedAt: '2026-06-25T09:30:00+05:30',
    updatedAt: '2026-06-26T07:15:00+05:30',
    readMinutes: 8,
    wordCount: 1750,
    verification: 'verified',
    sourceCount: 14,
    format: 'article',
    isExclusive: true,
    views: 84_210,
    body: [
      {
        type: 'p',
        text:
          'When the Monsoon Session opens on Monday, the government will table seven priority bills — each carrying political stakes well beyond the headlines they will generate.',
      },
      {
        type: 'p',
        text:
          'Three of those bills, this paper has learned, were finalised only in the past 72 hours. The opposition, briefed in shortened all-party meetings, is preparing a coordinated response that could see Parliament adjourn within its first hour on at least two days.',
      },
      { type: 'h2', text: 'The seven bills, ranked by political risk' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Personal Data Protection (Amendment) Bill, 2026 — narrows exemptions for state agencies.',
          'Electoral Funding Transparency Bill — replaces electoral bonds with a public registry.',
          'Digital India Act — sweeping rewrite of the IT Act, 2000.',
          'Uniform Civil Code (Framework) Bill — a non-binding framework for states.',
          'Higher Education Regulation Bill — replaces UGC and AICTE with a single regulator.',
          'Bharatiya Nyaya Sanhita (Second Amendment) — clarifies sedition-related provisions.',
          'GST Council (Amendment) Bill — adjusts voting weights for smaller states.',
        ],
      },
      { type: 'h2', text: 'Why the data protection bill matters most' },
      {
        type: 'p',
        text:
          'Senior officials at the Ministry of Electronics and IT confirmed that the proposed amendments would narrow — not widen — exemptions available to state agencies under the original 2023 law. That itself is a reversal from the position the same officials defended in 2024.',
      },
      {
        type: 'quote',
        text:
          'The signal here is that the government has read the courts correctly. The Supreme Court\'s 2025 observations made the earlier framework politically expensive to defend.',
        cite: 'Senior counsel, briefed on the bill',
      },
      {
        type: 'p',
        text:
          'Privacy advocates, however, point out that the amendments still preserve broad discretion for the Centre to issue exemptions by notification — a route that bypasses parliamentary scrutiny.',
      },
      { type: 'h2', text: 'The opposition\'s opening move' },
      {
        type: 'p',
        text:
          'INDIA bloc floor leaders met on Sunday evening at the residence of the Leader of the Opposition. According to three people present, the bloc has agreed to seek references to standing committees for at least four of the seven bills — a tactical choice designed to slow the legislative calendar without appearing obstructive.',
      },
      {
        type: 'callout',
        tone: 'info',
        text:
          'Bills referred to a standing committee typically take 90 days for review, pushing the timeline past the winter session.',
      },
      { type: 'h3', text: 'What to watch in the first 48 hours' },
      {
        type: 'p',
        text:
          'The first test comes on Tuesday morning. If the Speaker disallows opposition adjournment motions on at least two of the bills, expect coordinated walkouts and a heated press conference at Vijay Chowk by lunchtime.',
      },
      {
        type: 'p',
        text:
          'This story will be updated through the session. Track our daily Parliament brief for floor counts, voting records and amendment tracking.',
      },
    ],
    relatedIds: ['art-3', 'art-6', 'art-9'],
  },
  {
    id: 'art-2',
    slug: 'maharashtra-bypoll-results-shifting-alliances',
    title: 'Maharashtra bypoll results signal shifting alliances ahead of 2027',
    kicker: 'Elections',
    excerpt:
      'A clean sweep in Vidarbha, a split verdict in Marathwada, and a surprise in Mumbai\'s western suburbs. The numbers tell a story the headlines miss.',
    category: 'elections',
    tags: ['Maharashtra', 'Bypoll', 'Mahayuti', 'MVA'],
    image: img('maharashtra-1'),
    author: A(4),
    publishedAt: '2026-06-25T18:45:00+05:30',
    readMinutes: 6,
    wordCount: 1320,
    verification: 'verified',
    sourceCount: 9,
    format: 'article',
    isBreaking: true,
    views: 142_300,
    body: [
      {
        type: 'p',
        text:
          'The eight-seat bypoll has produced the most consequential off-year result in Maharashtra in over a decade. Here are the numbers, the swing, and what they suggest about 2027.',
      },
      { type: 'h2', text: 'The headline result' },
      {
        type: 'p',
        text:
          'Of the eight seats, the ruling Mahayuti retained four, the MVA captured three, and one went to an independent. On seat count alone the result reads as status quo. The swing tells a different story.',
      },
      {
        type: 'stat',
        label: 'Average swing against ruling alliance',
        value: '-7.4%',
        sub: 'Compared to 2024 General Election baseline',
      },
      {
        type: 'p',
        text:
          'The 7.4 percentage-point average swing against the Mahayuti is in the same range as the swings that preceded government changes in Karnataka (2023) and Himachal Pradesh (2022). Bypolls are not general elections — but the direction is the data point that matters.',
      },
      { type: 'h2', text: 'Where the swing was sharpest' },
      {
        type: 'p',
        text:
          'Vidarbha\'s farmer constituencies showed the largest swings — an average of 11.2% — concentrated in seats where the soybean MSP debate dominated local coverage. In Marathwada, the swing was muted, suggesting the caste consolidation of 2024 has held.',
      },
      {
        type: 'callout',
        tone: 'note',
        text:
          'A 7-point swing in Vidarbha alone — held to general-election proportions — would flip 22 assembly seats.',
      },
      { type: 'h3', text: 'The Mumbai western suburbs surprise' },
      {
        type: 'p',
        text:
          'In Borivali-East, the independent candidate — a former civic activist — finished within 4,000 votes of the runner-up. That is not a fluke. It points to a hyperlocal anti-incumbency that neither alliance has yet decoded.',
      },
    ],
    relatedIds: ['art-7', 'art-10'],
  },
  {
    id: 'art-3',
    slug: 'electoral-bonds-replacement-explainer',
    title:
      'Electoral bonds are gone. What replaces them is more important than what came before.',
    kicker: 'Explainer',
    excerpt:
      'A plain-language guide to the proposed Electoral Funding Transparency Bill — what it changes, what it preserves, and the loopholes nobody is talking about.',
    category: 'explainers',
    tags: ['Electoral Bonds', 'Transparency', 'Funding'],
    image: img('explainer-1'),
    author: A(5),
    publishedAt: '2026-06-24T14:00:00+05:30',
    readMinutes: 7,
    wordCount: 1480,
    verification: 'verified',
    sourceCount: 11,
    format: 'article',
    views: 56_780,
    body: [
      {
        type: 'p',
        text:
          'In February 2024, the Supreme Court struck down the electoral bonds scheme. Two years and one general election later, Parliament is finally voting on what replaces it.',
      },
      { type: 'h2', text: 'What changes' },
      {
        type: 'list',
        items: [
          'A public registry of all political donations above ₹2,000 — searchable, downloadable, machine-readable.',
          'A 14-day disclosure window, replacing the annual filing under the existing law.',
          'Penalties of up to ₹10 lakh per non-disclosure, levied on the party rather than the donor.',
        ],
      },
      { type: 'h2', text: 'What stays the same' },
      {
        type: 'p',
        text:
          'Donations from foreign-controlled Indian entities remain permitted under the 2018 FCRA amendments. The new bill does not touch that provision. For the largest donors, the practical impact is limited.',
      },
      {
        type: 'quote',
        text:
          'Disclosure is necessary but not sufficient. Without caps, transparency simply tells you who paid for what — not whether the payment should have been allowed at all.',
        cite: 'Association for Democratic Reforms, submission to standing committee',
      },
      { type: 'h2', text: 'The loophole nobody is discussing' },
      {
        type: 'p',
        text:
          'The bill exempts donations routed through electoral trusts from the 14-day disclosure window, requiring only the annual aggregate. Electoral trusts received over 75% of corporate donations in the last cycle. The transparency promised by the headline figure shrinks accordingly.',
      },
    ],
    relatedIds: ['art-1', 'art-11'],
  },
  {
    id: 'art-4',
    slug: 'south-india-fertility-rate-policy',
    title:
      'Why five southern states are quietly preparing for the population-deficit decade',
    kicker: 'Long Read',
    excerpt:
      'Tamil Nadu, Kerala, Karnataka, Andhra Pradesh and Telangana now have fertility rates below replacement. The political consequences will reshape federalism.',
    category: 'opinion',
    tags: ['Federalism', 'Demographics', 'South India'],
    image: img('south-india-1'),
    author: A(5),
    publishedAt: '2026-06-23T08:00:00+05:30',
    readMinutes: 11,
    wordCount: 2240,
    verification: 'verified',
    sourceCount: 18,
    format: 'article',
    views: 38_450,
    body: [
      {
        type: 'p',
        text:
          'The 2026 delimitation exercise has been postponed twice. The reason, when it is finally explained in Parliament, will be demographic — and the politics of that explanation will be the defining federal debate of the decade.',
      },
      {
        type: 'p',
        text:
          'Across the five southern states, the total fertility rate has fallen below the replacement level of 2.1 — in some cases sharply. Tamil Nadu now sits at 1.6. Kerala at 1.5. In raw population terms, the South is heading for an absolute decline within twelve years.',
      },
      { type: 'h2', text: 'The seat-share problem' },
      {
        type: 'p',
        text:
          'Lok Sabha seats are allocated by population. If delimitation goes ahead on a 2031 census basis without political adjustment, southern states will lose a combined 32 seats relative to their current share. The North will gain them.',
      },
      {
        type: 'stat',
        label: 'Projected southern seat loss',
        value: '-32',
        sub: 'On 2031 population basis, no adjustment',
      },
      { type: 'h3', text: 'What the chief ministers are quietly asking for' },
      {
        type: 'p',
        text:
          'In three separate state-level resolutions passed this year, southern legislatures have asked for a delimitation freeze extension — first introduced in 1976 and extended in 2001. The next extension would need to be a constitutional amendment.',
      },
    ],
    relatedIds: ['art-1', 'art-3'],
  },
  {
    id: 'art-5',
    slug: 'viral-photo-pm-rally-fact-check',
    title:
      'No, that viral photo of the PM\'s rally was not from yesterday — here is when it was actually taken',
    kicker: 'Fact Check',
    excerpt:
      'A reverse image search, three witness accounts and an embedded metadata trace. The full evidence trail behind our verdict.',
    category: 'fact-check',
    tags: ['Misinformation', 'Image Verification'],
    image: img('factcheck-1'),
    author: A(3),
    publishedAt: '2026-06-24T19:20:00+05:30',
    readMinutes: 4,
    wordCount: 780,
    verification: 'verified',
    sourceCount: 6,
    factCheckId: 'fc-1',
    format: 'article',
    views: 67_900,
    body: [
      {
        type: 'p',
        text:
          'A photo claiming to show "empty seats" at yesterday\'s rally has been shared over 400,000 times across X, WhatsApp and Facebook by the time of writing. Our verification finds it was taken at a different event, in February 2023.',
      },
      { type: 'h2', text: 'The evidence' },
      {
        type: 'list',
        ordered: true,
        items: [
          'EXIF metadata on the highest-resolution circulating copy shows a capture date of 11 February 2023.',
          'Reverse image search located the original on a regional newspaper\'s archive, captioned with the 2023 date.',
          'Two photographers present at the 2023 event confirmed the angle and lighting to our team.',
          'Local police logs from yesterday\'s rally venue place attendance at the gate at 38,000 — a figure inconsistent with the empty rows shown in the image.',
        ],
      },
      { type: 'h2', text: 'Our rating: False' },
      {
        type: 'p',
        text:
          'The claim that the image depicts low attendance at yesterday\'s rally is false. The image is genuine but is being shared with a misleading context.',
      },
    ],
    relatedIds: ['art-9'],
  },
  {
    id: 'art-6',
    slug: 'supreme-court-electoral-rolls-judgment',
    title:
      'Supreme Court orders Election Commission to publish machine-readable electoral rolls within 60 days',
    kicker: 'Courts',
    excerpt:
      'A unanimous bench has ruled that the right to verify electoral rolls is part of Article 19. The decision could reshape election scrutiny.',
    category: 'politics',
    tags: ['Supreme Court', 'Election Commission', 'Transparency'],
    image: img('court-1'),
    author: A(0),
    publishedAt: '2026-06-24T11:30:00+05:30',
    readMinutes: 5,
    wordCount: 1050,
    verification: 'verified',
    sourceCount: 8,
    format: 'article',
    views: 49_200,
    body: [
      {
        type: 'p',
        text:
          'In a 3-0 ruling delivered Monday morning, a constitutional bench of the Supreme Court directed the Election Commission of India to publish all electoral rolls in machine-readable format within 60 days.',
      },
      { type: 'h2', text: 'What the bench said' },
      {
        type: 'quote',
        text:
          'The right to scrutinise public records that determine the composition of legislatures is not a privilege the State may withhold. It is an extension of the freedom of expression itself.',
        cite: 'Per the bench, paragraph 84',
      },
      { type: 'h2', text: 'Why it matters' },
      {
        type: 'p',
        text:
          'For the first time, researchers, journalists and civil society will be able to run systematic analyses on the full electoral roll — comparing entries across years, identifying anomalies, and verifying claims of large-scale additions or deletions.',
      },
    ],
    relatedIds: ['art-1'],
  },
  {
    id: 'art-7',
    slug: 'karnataka-coalition-tensions-cm-meeting',
    title: 'Karnataka coalition tensions surface in late-night CM meeting',
    kicker: 'State Watch',
    excerpt:
      'A leaked agenda, a postponed cabinet expansion, and the deputy CM\'s pointed absence. Inside the coalition\'s difficult week.',
    category: 'state-news',
    tags: ['Karnataka', 'Coalition', 'Bengaluru'],
    image: img('karnataka-1'),
    author: A(2),
    publishedAt: '2026-06-25T22:10:00+05:30',
    readMinutes: 4,
    wordCount: 820,
    verification: 'sourced',
    sourceCount: 5,
    format: 'article',
    views: 28_100,
    body: [
      {
        type: 'p',
        text:
          'A 90-minute meeting at the Chief Minister\'s residence on Tuesday night, attended by senior coalition partners but not the Deputy Chief Minister, has reopened questions about the longevity of the ruling alliance in Karnataka.',
      },
    ],
    relatedIds: ['art-2'],
  },
  {
    id: 'art-8',
    slug: 'india-g20-position-shift-multilateralism',
    title: 'India\'s G20 posture is quietly shifting — and the West has not noticed',
    kicker: 'Foreign Policy',
    excerpt:
      'New Delhi\'s positions in three recent G20 working groups suggest a more assertive coordination with the Global South.',
    category: 'international',
    tags: ['G20', 'Foreign Policy', 'Global South'],
    image: img('g20-1'),
    author: A(5),
    publishedAt: '2026-06-22T16:00:00+05:30',
    readMinutes: 9,
    wordCount: 1980,
    verification: 'verified',
    sourceCount: 12,
    format: 'article',
    views: 31_400,
    body: [
      {
        type: 'p',
        text:
          'Read across three working group communiqués this quarter, India\'s G20 negotiating stance has shifted in a direction that — taken individually — looks technical, but taken together looks deliberate.',
      },
    ],
    relatedIds: ['art-4'],
  },
  {
    id: 'art-9',
    slug: 'whatsapp-forwards-election-misinformation-pattern',
    title: 'The WhatsApp forwards driving this week\'s misinformation — mapped',
    kicker: 'Fact Check',
    excerpt:
      'We tracked 312 of the most-forwarded election claims across 47 WhatsApp groups. Three patterns emerge.',
    category: 'fact-check',
    tags: ['WhatsApp', 'Misinformation', 'Elections'],
    image: img('whatsapp-1'),
    author: A(3),
    publishedAt: '2026-06-23T10:45:00+05:30',
    readMinutes: 6,
    wordCount: 1340,
    verification: 'verified',
    sourceCount: 9,
    format: 'article',
    views: 44_700,
    body: [
      {
        type: 'p',
        text:
          'Over a 14-day window, our fact-check desk monitored 47 public-interest WhatsApp groups across nine states. We logged every forward that crossed three or more groups. The total: 312 claims.',
      },
    ],
    relatedIds: ['art-5'],
  },
  {
    id: 'art-10',
    slug: 'voter-turnout-women-rural-urban-divide',
    title:
      'Women out-voted men in three states this cycle. The pattern is now too consistent to ignore.',
    kicker: 'Data',
    excerpt:
      'Female turnout has overtaken male turnout in 9 of the last 12 state elections. The political consequences are still being underestimated.',
    category: 'politics',
    tags: ['Voter Turnout', 'Women', 'Data'],
    image: img('voters-1'),
    author: A(4),
    publishedAt: '2026-06-21T07:30:00+05:30',
    readMinutes: 7,
    wordCount: 1560,
    verification: 'verified',
    sourceCount: 10,
    format: 'article',
    views: 52_900,
    body: [
      {
        type: 'p',
        text:
          'Election Commission data, released last week, confirms what district-level analysis has been showing for two cycles: women are voting at higher rates than men in an expanding share of constituencies.',
      },
    ],
    relatedIds: ['art-2', 'art-4'],
  },
  {
    id: 'art-11',
    slug: 'opinion-press-freedom-self-censorship',
    title: 'The quietest form of censorship is the kind you do to yourself',
    kicker: 'Opinion',
    excerpt:
      'A senior editor on how India\'s newsroom culture is changing — and what the data on legal notices, ad revenue and source attrition actually shows.',
    category: 'opinion',
    tags: ['Press Freedom', 'Media'],
    image: img('opinion-1'),
    author: A(5),
    publishedAt: '2026-06-20T12:00:00+05:30',
    readMinutes: 8,
    wordCount: 1820,
    verification: 'sourced',
    sourceCount: 7,
    format: 'article',
    views: 24_300,
    body: [
      {
        type: 'p',
        text:
          'Most discussions about press freedom in India focus on the dramatic incidents — a raid, an arrest, a website blocked. Those matter. But they are not the texture of what has actually changed.',
      },
    ],
    relatedIds: ['art-3'],
  },
  {
    id: 'art-12',
    slug: 'budget-fiscal-deficit-projection-revision',
    title:
      'Centre revises fiscal deficit projection downward — analysts split on whether the numbers add up',
    kicker: 'Economy',
    excerpt:
      'The 5.1% target has been revised to 4.7%. Three economists explain why they are sceptical, and one explains why the revision is credible.',
    category: 'politics',
    tags: ['Budget', 'Fiscal Policy', 'Economy'],
    image: img('budget-1'),
    author: A(4),
    publishedAt: '2026-06-19T15:30:00+05:30',
    readMinutes: 6,
    wordCount: 1290,
    verification: 'verified',
    sourceCount: 8,
    format: 'article',
    views: 19_800,
    body: [
      {
        type: 'p',
        text:
          'The Finance Ministry\'s mid-year fiscal review, released on Wednesday, projects the deficit at 4.7% of GDP — down from the budgeted 5.1%. Markets responded positively. Economists are more cautious.',
      },
    ],
    relatedIds: ['art-1'],
  },
];

export const POLITICIANS: Politician[] = [
  {
    id: 'p1',
    slug: 'arjun-deshmukh',
    name: 'Arjun Deshmukh',
    party: 'Bharatiya Jana Vikas Party',
    partyShort: 'BJVP',
    partyColor: '#1E40AF',
    constituency: 'Pune North',
    state: 'Maharashtra',
    position: 'Member of Parliament',
    age: 54,
    bio:
      'Three-term MP from Pune North, former chairperson of the Parliamentary Standing Committee on Finance. Engineer by training, in active politics since 2004.',
    image: avatar('Arjun Deshmukh'),
    rating: 7.4,
    followers: 482_300,
    promises: [
      {
        id: 'pr1',
        text: 'Complete the Pune Metro Phase 3 extension by 2026',
        status: 'in-progress',
        madeOn: '2024-04-12',
        context: '2024 General Election manifesto',
      },
      {
        id: 'pr2',
        text: 'Set up two skill-development centres in the constituency',
        status: 'kept',
        madeOn: '2024-04-12',
      },
      {
        id: 'pr3',
        text: 'Resolve water shortage in 11 rural panchayats',
        status: 'broken',
        madeOn: '2019-03-20',
      },
      {
        id: 'pr4',
        text: 'Push for special economic zone status for Hinjewadi',
        status: 'in-progress',
        madeOn: '2024-04-12',
      },
      {
        id: 'pr5',
        text: 'Open a 24/7 grievance helpline at the constituency office',
        status: 'kept',
        madeOn: '2024-04-12',
      },
    ],
    timeline: [
      {
        date: '2024-06-04',
        title: 'Re-elected to Lok Sabha',
        description: 'Won Pune North with a margin of 1,12,400 votes.',
        kind: 'election',
      },
      {
        date: '2023-08-11',
        title: 'Appointed Chairperson, Standing Committee on Finance',
        description: 'Took over from the outgoing chair mid-term.',
        kind: 'milestone',
      },
      {
        date: '2022-02-04',
        title: 'Controversy over Pune Smart City contract',
        description: 'Named in audit observations; no charges filed.',
        kind: 'controversy',
      },
      {
        date: '2019-05-23',
        title: 'Elected to second term',
        description: 'Won by margin of 87,200 votes.',
        kind: 'election',
      },
    ],
    socials: {
      twitter: 'arjundeshmukh_in',
      instagram: 'arjun.deshmukh',
      facebook: 'arjundeshmukhmp',
      web: 'arjundeshmukh.in',
    },
    net_worth: '₹14.2 Cr',
    education: 'B.Tech (Civil), VJTI Mumbai',
    criminalCases: 0,
    attendance: 84,
    questionsAsked: 412,
  },
  {
    id: 'p2',
    slug: 'priya-raghavan',
    name: 'Priya Raghavan',
    party: 'Janata Samajwadi Morcha',
    partyShort: 'JSM',
    partyColor: '#DC2626',
    constituency: 'Chennai South',
    state: 'Tamil Nadu',
    position: 'Member of Parliament',
    age: 41,
    bio:
      'Lawyer, first-term MP, lead author of the Whistleblower Protection (Amendment) Private Member\'s Bill.',
    image: avatar('Priya Raghavan'),
    rating: 8.3,
    followers: 612_400,
    promises: [
      {
        id: 'pr6',
        text: 'Introduce a Private Member\'s Bill on data protection',
        status: 'kept',
        madeOn: '2024-04-08',
      },
      {
        id: 'pr7',
        text: 'Hold monthly public office hours in the constituency',
        status: 'kept',
        madeOn: '2024-04-08',
      },
      {
        id: 'pr8',
        text: 'Push for Chennai coastal protection legislation',
        status: 'in-progress',
        madeOn: '2024-04-08',
      },
    ],
    timeline: [
      {
        date: '2025-12-12',
        title: 'Spoke for 47 minutes on Digital India Bill',
        description: 'Longest opposition speech of the session.',
        kind: 'statement',
      },
      {
        date: '2024-06-04',
        title: 'Elected to first term',
        description: 'Defeated incumbent by 64,300 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'priyaraghavan', web: 'priyaraghavan.in' },
    net_worth: '₹3.8 Cr',
    education: 'BA, LLB (National Law School, Bengaluru)',
    criminalCases: 0,
    attendance: 96,
    questionsAsked: 318,
  },
  {
    id: 'p3',
    slug: 'rajiv-banerjee',
    name: 'Rajiv Banerjee',
    party: 'Banglar Pragati Front',
    partyShort: 'BPF',
    partyColor: '#15803D',
    constituency: 'Howrah',
    state: 'West Bengal',
    position: 'Cabinet Minister, Urban Development',
    age: 62,
    bio:
      'Five-term legislator, holds the urban development portfolio at the state level. Architect of the Kolkata 2030 plan.',
    image: avatar('Rajiv Banerjee'),
    rating: 6.1,
    followers: 318_700,
    promises: [
      {
        id: 'pr9',
        text: 'Operationalise Howrah Metro extension',
        status: 'in-progress',
        madeOn: '2023-04-10',
      },
      {
        id: 'pr10',
        text: 'Clean-up of Hooghly riverfront — Phase 1',
        status: 'kept',
        madeOn: '2023-04-10',
      },
      {
        id: 'pr11',
        text: 'Affordable housing scheme — 50,000 units',
        status: 'broken',
        madeOn: '2018-03-15',
        context: 'Delivered 18,400 units against the promise',
      },
    ],
    timeline: [
      {
        date: '2024-09-04',
        title: 'Inaugurated Hooghly riverfront Phase 1',
        description: '12 km stretch opened to the public.',
        kind: 'milestone',
      },
      {
        date: '2023-05-02',
        title: 'Re-appointed to cabinet',
        description: 'Retained Urban Development portfolio.',
        kind: 'milestone',
      },
    ],
    socials: { twitter: 'rajivbanerjee_in', facebook: 'rajivbanerjeemla' },
    net_worth: '₹22.7 Cr',
    education: 'B.Com, Calcutta University',
    criminalCases: 2,
    attendance: 73,
    questionsAsked: 156,
  },
  {
    id: 'p4',
    slug: 'meera-vajpayee',
    name: 'Meera Vajpayee',
    party: 'Bharatiya Jana Vikas Party',
    partyShort: 'BJVP',
    partyColor: '#1E40AF',
    constituency: 'Lucknow',
    state: 'Uttar Pradesh',
    position: 'Member of Parliament',
    age: 49,
    bio:
      'Former journalist, two-term MP, vocal on women\'s representation and rural connectivity.',
    image: avatar('Meera Vajpayee'),
    rating: 7.8,
    followers: 421_500,
    promises: [
      {
        id: 'pr12',
        text: 'Establish a women\'s safety task force in Lucknow',
        status: 'kept',
        madeOn: '2024-04-12',
      },
      {
        id: 'pr13',
        text: 'Push for 33% reservation implementation timeline',
        status: 'in-progress',
        madeOn: '2024-04-12',
      },
    ],
    timeline: [
      {
        date: '2024-06-04',
        title: 'Re-elected to Lok Sabha',
        description: 'Won Lucknow by 1,42,300 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'meeravajpayee' },
    net_worth: '₹8.4 Cr',
    education: 'MA Mass Communication, AJK MCRC Jamia',
    criminalCases: 0,
    attendance: 91,
    questionsAsked: 287,
  },
  {
    id: 'p5',
    slug: 'farhan-khan',
    name: 'Farhan Khan',
    party: 'Janata Samajwadi Morcha',
    partyShort: 'JSM',
    partyColor: '#DC2626',
    constituency: 'Hyderabad Old City',
    state: 'Telangana',
    position: 'Member of Legislative Assembly',
    age: 45,
    bio:
      'Lawyer, civil rights advocate, three-term MLA. Active on urban poverty and minority education.',
    image: avatar('Farhan Khan'),
    rating: 7.5,
    followers: 287_100,
    promises: [
      {
        id: 'pr14',
        text: 'Open three new government schools in the old city',
        status: 'kept',
        madeOn: '2023-11-20',
      },
      {
        id: 'pr15',
        text: 'Resolve property title disputes for 1,200 families',
        status: 'in-progress',
        madeOn: '2023-11-20',
      },
    ],
    timeline: [
      {
        date: '2023-12-03',
        title: 'Elected to third term',
        description: 'Won by 28,400 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'farhankhan_mla', instagram: 'farhankhan.in' },
    net_worth: '₹2.1 Cr',
    education: 'BA, LLB Osmania University',
    criminalCases: 1,
    attendance: 88,
    questionsAsked: 198,
  },
  {
    id: 'p6',
    slug: 'devika-sharma',
    name: 'Devika Sharma',
    party: 'Aam Aadmi Manch',
    partyShort: 'AAM',
    partyColor: '#0EA5E9',
    constituency: 'New Delhi',
    state: 'Delhi',
    position: 'Member of Legislative Assembly',
    age: 36,
    bio:
      'Youngest MLA from her party, public-policy researcher before entering politics. Known for the Right to Clean Air resolution.',
    image: avatar('Devika Sharma'),
    rating: 8.0,
    followers: 524_600,
    promises: [
      {
        id: 'pr16',
        text: 'Pass Right to Clean Air resolution',
        status: 'kept',
        madeOn: '2025-02-08',
      },
      {
        id: 'pr17',
        text: 'Open 25 mohalla clinics in the constituency',
        status: 'in-progress',
        madeOn: '2025-02-08',
      },
    ],
    timeline: [
      {
        date: '2025-02-09',
        title: 'Elected to first term',
        description: 'Won New Delhi by 14,200 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'devikasharma_in', instagram: 'devika.sharma' },
    net_worth: '₹1.6 Cr',
    education: 'MPP, Harvard Kennedy School',
    criminalCases: 0,
    attendance: 94,
    questionsAsked: 142,
  },
  {
    id: 'p7',
    slug: 'venkatesh-rao',
    name: 'Venkatesh Rao',
    party: 'Telugu Desa Samakhya',
    partyShort: 'TDS',
    partyColor: '#FBBF24',
    constituency: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    position: 'Member of Parliament',
    age: 58,
    bio:
      'Former bureaucrat, two-term MP. Lead voice on port development and coastal economic zones.',
    image: avatar('Venkatesh Rao'),
    rating: 7.0,
    followers: 198_300,
    promises: [
      {
        id: 'pr18',
        text: 'Push for Vizag deep-sea port expansion',
        status: 'in-progress',
        madeOn: '2024-04-12',
      },
    ],
    timeline: [
      {
        date: '2024-06-04',
        title: 'Re-elected to Lok Sabha',
        description: 'Won Visakhapatnam by 76,800 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'venkateshraomp' },
    net_worth: '₹11.4 Cr',
    education: 'IAS (Retd), MA Economics, Delhi School of Economics',
    criminalCases: 0,
    attendance: 81,
    questionsAsked: 264,
  },
  {
    id: 'p8',
    slug: 'simran-kaur',
    name: 'Simran Kaur',
    party: 'Punjab Lok Front',
    partyShort: 'PLF',
    partyColor: '#15803D',
    constituency: 'Amritsar',
    state: 'Punjab',
    position: 'Member of Legislative Assembly',
    age: 43,
    bio:
      'Activist-turned-legislator, leads on farm policy and border-area development.',
    image: avatar('Simran Kaur'),
    rating: 7.6,
    followers: 233_900,
    promises: [
      {
        id: 'pr19',
        text: 'Set up crop diversification subsidy in three blocks',
        status: 'kept',
        madeOn: '2022-03-10',
      },
      {
        id: 'pr20',
        text: 'Resolve stubble-burning penalty grievances',
        status: 'in-progress',
        madeOn: '2022-03-10',
      },
    ],
    timeline: [
      {
        date: '2022-03-10',
        title: 'Elected to first term',
        description: 'Won Amritsar by 31,200 votes.',
        kind: 'election',
      },
    ],
    socials: { twitter: 'simrankaur_mla' },
    net_worth: '₹2.9 Cr',
    education: 'BA Political Science, Panjab University',
    criminalCases: 0,
    attendance: 92,
    questionsAsked: 176,
  },
];

export const PARTIES: Party[] = [
  {
    id: 'pty1',
    slug: 'bjvp',
    name: 'Bharatiya Jana Vikas Party',
    short: 'BJVP',
    color: '#1E40AF',
    founded: 1980,
    ideology: ['Centre-right', 'Nationalism', 'Economic liberalism'],
    leader: 'Arjun Deshmukh',
    seats: 240,
  },
  {
    id: 'pty2',
    slug: 'jsm',
    name: 'Janata Samajwadi Morcha',
    short: 'JSM',
    color: '#DC2626',
    founded: 1969,
    ideology: ['Centre-left', 'Social democracy', 'Secularism'],
    leader: 'Priya Raghavan',
    seats: 99,
  },
  {
    id: 'pty3',
    slug: 'aam',
    name: 'Aam Aadmi Manch',
    short: 'AAM',
    color: '#0EA5E9',
    founded: 2012,
    ideology: ['Populism', 'Anti-corruption', 'Welfare'],
    leader: 'Devika Sharma',
    seats: 22,
  },
  {
    id: 'pty4',
    slug: 'bpf',
    name: 'Banglar Pragati Front',
    short: 'BPF',
    color: '#15803D',
    founded: 1998,
    ideology: ['Regional', 'Centre-left', 'Bengali identity'],
    leader: 'Rajiv Banerjee',
    seats: 29,
  },
];

export const FACT_CHECKS: FactCheck[] = [
  {
    id: 'fc-1',
    slug: 'viral-pm-rally-photo',
    claim:
      'Photo shows empty seats at PM\'s rally yesterday, proving low attendance.',
    claimant: 'Viral on WhatsApp, X and Facebook',
    rating: 'false',
    verdict:
      'The photo is genuine but from a different event in February 2023. Yesterday\'s rally had 38,000 attendees per police logs.',
    evidence: [
      'EXIF metadata shows capture date of 11 February 2023.',
      'Reverse image search located the original on a 2023 archive.',
      'Two photographers confirmed angle and lighting to a 2023 venue.',
      'Police logs from yesterday\'s rally show 38,000 attendees.',
    ],
    sources: [
      { label: 'Regional newspaper archive (Feb 2023)', url: '#' },
      { label: 'Police venue log (yesterday)', url: '#' },
    ],
    author: AUTHORS[3],
    publishedAt: '2026-06-24T19:20:00+05:30',
    image: img('factcheck-1'),
    views: 67_900,
  },
  {
    id: 'fc-2',
    slug: 'edited-video-opposition-leader',
    claim:
      'Video shows opposition leader saying he wants to "abolish reservations".',
    claimant: 'Forwarded on Facebook reels',
    rating: 'false',
    verdict:
      'The video is edited. The full clip shows the speaker quoting a critic and rebutting the position, not endorsing it.',
    evidence: [
      'Full original speech is 14 minutes; the clip is 17 seconds.',
      'Context immediately before and after the clip reverses the meaning.',
      'Speaker\'s office has released the full transcript and the unedited recording.',
    ],
    sources: [
      { label: 'Full speech video (party official channel)', url: '#' },
      { label: 'Press release with transcript', url: '#' },
    ],
    author: AUTHORS[3],
    publishedAt: '2026-06-22T11:00:00+05:30',
    image: img('factcheck-2'),
    views: 41_200,
  },
  {
    id: 'fc-3',
    slug: 'inflation-graph-misleading-axis',
    claim:
      'Government graph shows inflation has dropped 60% in the last year.',
    claimant: 'Official social media handle',
    rating: 'misleading',
    verdict:
      'The graph is technically correct but uses a truncated y-axis that exaggerates the drop. Re-plotted with a zero baseline, the change is from 5.8% to 4.2%.',
    evidence: [
      'Y-axis starts at 4%, not 0%, exaggerating visual change.',
      'Re-plotted with conventional axis, change is 1.6 percentage points.',
      'RBI\'s own bulletin uses a zero baseline for the same data.',
    ],
    sources: [
      { label: 'RBI monthly bulletin', url: '#' },
      { label: 'Ministry of Statistics CPI series', url: '#' },
    ],
    author: AUTHORS[3],
    publishedAt: '2026-06-20T15:30:00+05:30',
    image: img('factcheck-3'),
    views: 33_400,
  },
  {
    id: 'fc-4',
    slug: 'budget-allocation-women-schemes',
    claim: 'Budget allocation for women\'s schemes has doubled this year.',
    claimant: 'Ruling-party press release',
    rating: 'mostly-true',
    verdict:
      'The headline allocation has nearly doubled in nominal terms. Adjusted for the scheme reclassification that moved three programmes into this category, the real increase is closer to 34%.',
    evidence: [
      'Headline number: ₹2.4 lakh crore vs ₹1.3 lakh crore.',
      'Three schemes were moved from other ministries into this category mid-year.',
      'Like-for-like comparison gives a 34% increase, still meaningful.',
    ],
    sources: [
      { label: 'Budget Annex VIII', url: '#' },
      { label: 'PRS Legislative Research analysis', url: '#' },
    ],
    author: AUTHORS[3],
    publishedAt: '2026-06-18T09:45:00+05:30',
    image: img('factcheck-4'),
    views: 27_100,
  },
  {
    id: 'fc-5',
    slug: 'unemployment-rate-claim',
    claim: 'India\'s unemployment rate is at a 45-year low.',
    claimant: 'Cabinet minister, televised interview',
    rating: 'misleading',
    verdict:
      'The claim relies on the PLFS Usual Status definition, which counts a person as employed if they worked at all in the past 365 days. By the Current Weekly Status definition (international comparator), the rate is higher and not at a multi-decade low.',
    evidence: [
      'PLFS reports two unemployment rates; the claim cites only the lower.',
      'CWS rate for the same period is 4.4%, not the lowest on record.',
      'Female labour force participation remains a key drag on aggregate figures.',
    ],
    sources: [
      { label: 'PLFS Annual Report', url: '#' },
      { label: 'CMIE quarterly analysis', url: '#' },
    ],
    author: AUTHORS[3],
    publishedAt: '2026-06-15T17:20:00+05:30',
    image: img('factcheck-5'),
    views: 51_800,
  },
];

export const VIDEOS: Video[] = [
  {
    id: 'v1',
    slug: 'monsoon-session-preview',
    title: 'Monsoon Session preview: The seven bills explained in 12 minutes',
    description:
      'Our political editor walks through every bill, the politics, and what to expect on day one.',
    thumbnail: img('video-1', 800, 450),
    duration: '12:34',
    category: 'politics',
    views: 184_500,
    publishedAt: '2026-06-25T20:00:00+05:30',
    series: 'The Brief',
    host: 'Karan Joshi',
  },
  {
    id: 'v2',
    slug: 'maharashtra-bypoll-postmortem',
    title: 'Maharashtra bypoll postmortem — the swing, the seats, the signal',
    description:
      'A constituency-by-constituency breakdown of the bypoll result and what it means for 2027.',
    thumbnail: img('video-2', 800, 450),
    duration: '18:21',
    category: 'elections',
    views: 96_200,
    publishedAt: '2026-06-25T21:30:00+05:30',
    series: 'The Brief',
    host: 'Karan Joshi',
  },
  {
    id: 'v3',
    slug: 'electoral-bonds-replacement-deep-dive',
    title: 'Electoral bonds are gone. The replacement is more complicated.',
    description:
      'A 22-minute deep dive into the new transparency bill, with three legal experts.',
    thumbnail: img('video-3', 800, 450),
    duration: '22:48',
    category: 'explainers',
    views: 73_400,
    publishedAt: '2026-06-24T19:00:00+05:30',
    series: 'Deep Dive',
    host: 'Karan Joshi',
  },
  {
    id: 'v4',
    slug: 'fact-check-viral-photo',
    title: 'Fact check: We traced the viral rally photo. Here is what we found.',
    description: 'The full evidence trail, from EXIF data to witness accounts.',
    thumbnail: img('video-4', 800, 450),
    duration: '6:42',
    category: 'fact-check',
    views: 124_800,
    publishedAt: '2026-06-24T21:00:00+05:30',
    series: 'Fact Check',
    host: 'Tariq Ahmed',
  },
  {
    id: 'v5',
    slug: 'south-india-demographics',
    title: 'Why the South is preparing for a population-deficit decade',
    description: 'Demographics, federalism, and the politics of fewer seats.',
    thumbnail: img('video-5', 800, 450),
    duration: '15:09',
    category: 'opinion',
    views: 58_300,
    publishedAt: '2026-06-23T08:30:00+05:30',
    series: 'Long Take',
    host: 'Lakshmi Iyer',
  },
  {
    id: 'v6',
    slug: 'parliament-day-1-recap',
    title: 'Parliament Day 1 recap: Adjournments, walkouts and one surprise',
    description: 'A quick wrap of everything that happened on the first day.',
    thumbnail: img('video-6', 800, 450),
    duration: '8:55',
    category: 'politics',
    views: 41_700,
    publishedAt: '2026-06-26T19:45:00+05:30',
    series: 'The Brief',
    host: 'Karan Joshi',
  },
  {
    id: 'v7',
    slug: 'women-voter-turnout-explainer',
    title: 'Women out-voted men in three states. What does that change?',
    description:
      'A data explainer on the most-overlooked political shift of the decade.',
    thumbnail: img('video-7', 800, 450),
    duration: '11:18',
    category: 'explainers',
    views: 38_900,
    publishedAt: '2026-06-21T08:00:00+05:30',
    series: 'Data Lab',
    host: 'Prerna Singh',
  },
  {
    id: 'v8',
    slug: 'g20-india-position',
    title: 'India\'s G20 posture is shifting — and the West has not noticed',
    description: 'A foreign-policy deep dive on India\'s G20 negotiating stance.',
    thumbnail: img('video-8', 800, 450),
    duration: '24:02',
    category: 'international',
    views: 29_500,
    publishedAt: '2026-06-22T16:30:00+05:30',
    series: 'Deep Dive',
    host: 'Devraj Pillai',
  },
];

export const PODCASTS: Podcast[] = [
  {
    id: 'pod-1',
    slug: 'daily-brief-jun-26',
    title: 'Daily Brief — Monsoon Session, Day One',
    series: 'TheQuiverIndia Daily',
    description:
      'Twenty minutes on everything you need to know this morning: the seven bills, the bypoll fallout, the court order.',
    artwork: img('pod-1', 600, 600),
    duration: '21:14',
    host: 'Karan Joshi',
    episode: 412,
    publishedAt: '2026-06-26T07:00:00+05:30',
    plays: 28_400,
  },
  {
    id: 'pod-2',
    slug: 'long-form-electoral-bonds',
    title: 'The Quiet Death of Electoral Bonds — and What Comes Next',
    series: 'Long Form',
    description:
      'A 58-minute conversation with three election-law experts on the new transparency framework.',
    artwork: img('pod-2', 600, 600),
    duration: '58:32',
    host: 'Ananya Mehra',
    episode: 47,
    publishedAt: '2026-06-24T18:00:00+05:30',
    plays: 14_700,
  },
  {
    id: 'pod-3',
    slug: 'south-india-demographics',
    title: 'The Demographic Divide That Will Reshape Federalism',
    series: 'Long Form',
    description:
      'Why the southern states are preparing for fewer seats — and what that means for India.',
    artwork: img('pod-3', 600, 600),
    duration: '46:18',
    host: 'Lakshmi Iyer',
    episode: 46,
    publishedAt: '2026-06-23T09:00:00+05:30',
    plays: 11_200,
  },
  {
    id: 'pod-4',
    slug: 'fact-check-weekly',
    title: 'Fact Check Weekly — What WhatsApp Told Us This Week',
    series: 'Fact Check Weekly',
    description:
      'The five most-forwarded claims of the past seven days, rated and sourced.',
    artwork: img('pod-4', 600, 600),
    duration: '27:48',
    host: 'Tariq Ahmed',
    episode: 89,
    publishedAt: '2026-06-22T18:00:00+05:30',
    plays: 19_300,
  },
  {
    id: 'pod-5',
    slug: 'voices-from-marathwada',
    title: 'Voices from Marathwada — Why the Swing Stalled',
    series: 'Voices',
    description: 'A ground report from five constituencies in Marathwada.',
    artwork: img('pod-5', 600, 600),
    duration: '32:05',
    host: 'Rohan Khurana',
    episode: 12,
    publishedAt: '2026-06-25T11:00:00+05:30',
    plays: 8_900,
  },
  {
    id: 'pod-6',
    slug: 'opinion-press-freedom',
    title: 'The Quietest Form of Censorship',
    series: 'Long Form',
    description: 'A senior editor on what has actually changed in Indian newsrooms.',
    artwork: img('pod-6', 600, 600),
    duration: '41:22',
    host: 'Devraj Pillai',
    episode: 45,
    publishedAt: '2026-06-20T12:30:00+05:30',
    plays: 16_400,
  },
];

export const POLLS: Poll[] = [
  {
    id: 'poll-1',
    slug: 'monsoon-session-priority-bill',
    question: 'Which of these bills should be Parliament\'s top priority?',
    description:
      'Pick the one bill you most want passed this session. Results updated live.',
    options: [
      { id: 'o1', label: 'Data Protection Amendment', votes: 18_400, color: '#3B82F6' },
      { id: 'o2', label: 'Electoral Funding Transparency', votes: 27_300, color: '#F97316' },
      { id: 'o3', label: 'Higher Education Regulation', votes: 9_200, color: '#10B981' },
      { id: 'o4', label: 'Uniform Civil Code Framework', votes: 14_700, color: '#EC4899' },
      { id: 'o5', label: 'Digital India Act', votes: 11_500, color: '#8B5CF6' },
    ],
    totalVotes: 81_100,
    endsAt: '2026-07-03T23:59:00+05:30',
    category: 'politics',
  },
  {
    id: 'poll-2',
    slug: 'maharashtra-2027',
    question: 'If Maharashtra Assembly elections were held tomorrow, who would you vote for?',
    options: [
      { id: 'o1', label: 'Mahayuti', votes: 32_400, color: '#F97316' },
      { id: 'o2', label: 'MVA', votes: 41_200, color: '#15803D' },
      { id: 'o3', label: 'Independent / Other', votes: 7_800, color: '#737373' },
      { id: 'o4', label: 'Undecided', votes: 18_600, color: '#94A3B8' },
    ],
    totalVotes: 100_000,
    endsAt: '2026-07-10T23:59:00+05:30',
    category: 'elections',
    state: 'Maharashtra',
  },
  {
    id: 'poll-3',
    slug: 'press-freedom-perception',
    question: 'Do you trust the news you read on social media more or less than a year ago?',
    options: [
      { id: 'o1', label: 'A lot less', votes: 14_700 },
      { id: 'o2', label: 'A little less', votes: 18_900 },
      { id: 'o3', label: 'About the same', votes: 8_200 },
      { id: 'o4', label: 'A little more', votes: 4_100 },
      { id: 'o5', label: 'A lot more', votes: 2_400 },
    ],
    totalVotes: 48_300,
    endsAt: '2026-07-01T23:59:00+05:30',
    category: 'opinion',
  },
  {
    id: 'poll-4',
    slug: 'top-issue-2026',
    question: 'What is the single most important issue facing India today?',
    options: [
      { id: 'o1', label: 'Jobs & Economy', votes: 38_200 },
      { id: 'o2', label: 'Inflation & Cost of Living', votes: 27_400 },
      { id: 'o3', label: 'Corruption', votes: 14_800 },
      { id: 'o4', label: 'Healthcare', votes: 9_300 },
      { id: 'o5', label: 'Climate & Air Quality', votes: 7_100 },
      { id: 'o6', label: 'Education', votes: 5_900 },
    ],
    totalVotes: 102_700,
    endsAt: '2026-07-15T23:59:00+05:30',
    category: 'trending',
  },
  {
    id: 'poll-5',
    slug: 'fact-check-trust',
    question: 'When you see a political claim online, what do you do first?',
    options: [
      { id: 'o1', label: 'Believe it if it matches my view' },
      { id: 'o2', label: 'Search for a fact-check' },
      { id: 'o3', label: 'Ask someone I trust' },
      { id: 'o4', label: 'Ignore it' },
    ].map((o, i) => ({
      ...o,
      votes: [4200, 18900, 9300, 6700][i],
    })),
    totalVotes: 39_100,
    endsAt: '2026-07-05T23:59:00+05:30',
    category: 'fact-check',
  },
  {
    id: 'poll-6',
    slug: 'delimitation-position',
    question: 'On delimitation, the southern states are asking for a freeze extension. Your view?',
    options: [
      { id: 'o1', label: 'Extend the freeze', votes: 28_400 },
      { id: 'o2', label: 'Proceed with delimitation', votes: 22_100 },
      { id: 'o3', label: 'Need a compromise formula', votes: 31_700 },
      { id: 'o4', label: 'Don\'t know enough', votes: 11_200 },
    ],
    totalVotes: 93_400,
    endsAt: '2026-07-20T23:59:00+05:30',
    category: 'politics',
  },
];

export const LIVE_UPDATES: LiveUpdate[] = [
  {
    id: 'l1',
    time: '2026-06-26T11:42:00+05:30',
    text: 'Lok Sabha adjourned till 2 PM after opposition protests on Data Protection Bill.',
    tag: 'parliament',
    location: 'New Delhi',
  },
  {
    id: 'l2',
    time: '2026-06-26T10:55:00+05:30',
    text: 'Maharashtra Election Commission notifies bypoll results for all eight seats.',
    tag: 'election',
    location: 'Mumbai',
  },
  {
    id: 'l3',
    time: '2026-06-26T10:18:00+05:30',
    text: 'Supreme Court takes suo motu cognizance of viral deepfake video circulating since yesterday.',
    tag: 'breaking',
    location: 'New Delhi',
  },
  {
    id: 'l4',
    time: '2026-06-26T09:34:00+05:30',
    text: 'Karnataka cabinet expansion postponed for the second time this month.',
    tag: 'developing',
    location: 'Bengaluru',
  },
  {
    id: 'l5',
    time: '2026-06-26T09:10:00+05:30',
    text: 'PM addresses Monsoon Session opening, lists nine priority bills.',
    tag: 'statement',
    location: 'New Delhi',
  },
  {
    id: 'l6',
    time: '2026-06-26T08:42:00+05:30',
    text: 'Tamil Nadu Chief Minister meets coalition partners ahead of budget vote.',
    tag: 'parliament',
    location: 'Chennai',
  },
  {
    id: 'l7',
    time: '2026-06-26T08:05:00+05:30',
    text: 'Election Commission releases revised constituency boundaries draft for public review.',
    tag: 'election',
    location: 'New Delhi',
  },
  {
    id: 'l8',
    time: '2026-06-26T07:30:00+05:30',
    text: 'Opposition leaders meet at LoP residence — coordination strategy finalised.',
    tag: 'developing',
    location: 'New Delhi',
  },
  {
    id: 'l9',
    time: '2026-06-25T22:48:00+05:30',
    text: 'Maharashtra bypoll: All counts complete. Mahayuti retains 4, MVA wins 3, IND 1.',
    tag: 'election',
    location: 'Mumbai',
  },
  {
    id: 'l10',
    time: '2026-06-25T19:12:00+05:30',
    text: 'PM addresses public rally in Pune ahead of bypoll counting.',
    tag: 'statement',
    location: 'Pune',
  },
  {
    id: 'l11',
    time: '2026-06-25T17:30:00+05:30',
    text: 'Lok Sabha Speaker confirms business advisory committee meeting for Monday.',
    tag: 'parliament',
    location: 'New Delhi',
  },
  {
    id: 'l12',
    time: '2026-06-25T15:18:00+05:30',
    text: 'Andhra Pradesh High Court reserves verdict on local body election petitions.',
    tag: 'breaking',
    location: 'Amaravati',
  },
];

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

export function findArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function findPolitician(slug: string) {
  return POLITICIANS.find((p) => p.slug === slug);
}

export function findFactCheck(slug: string) {
  return FACT_CHECKS.find((f) => f.slug === slug);
}

export function findVideo(slug: string) {
  return VIDEOS.find((v) => v.slug === slug);
}

export function findPodcast(slug: string) {
  return PODCASTS.find((p) => p.slug === slug);
}

export function findPoll(slug: string) {
  return POLLS.find((p) => p.slug === slug);
}

export function findStateResult(state: string) {
  return ELECTION_RESULTS_2024.find(
    (r) => r.state.toLowerCase() === state.toLowerCase(),
  );
}

export function articlesByCategory(category: string) {
  return ARTICLES.filter((a) => a.category === category);
}

export function relatedArticles(article: Article) {
  if (article.relatedIds?.length) {
    return article.relatedIds
      .map((id) => ARTICLES.find((a) => a.id === id))
      .filter(Boolean) as Article[];
  }
  return ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category,
  ).slice(0, 3);
}

export const TRENDING_TAGS = [
  'Monsoon Session',
  'Electoral Bonds',
  'Maharashtra Bypoll',
  'Supreme Court',
  'Delimitation',
  'Data Protection',
  'Coalition',
  'Fact Check',
];

export const EDITORS_PICKS = ['art-1', 'art-3', 'art-4', 'art-10']
  .map((id) => ARTICLES.find((a) => a.id === id))
  .filter(Boolean) as Article[];

export const MOST_READ = [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 5);
