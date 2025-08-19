export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  link: string;
  image: string;
  topic: 'Politics' | 'Humanitarian' | 'Conflict';
};

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Ceasefire Talks Resume Amidst Heightened Tensions',
    source: 'Al Jazeera',
    date: '2023-10-26',
    excerpt: 'Diplomatic efforts to secure a lasting ceasefire have resumed this week, with international mediators pushing for a peaceful resolution.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Politics',
  },
  {
    id: '2',
    title: 'Humanitarian Aid Blockade Worsens Crisis in Gaza',
    source: 'Reuters',
    date: '2023-10-25',
    excerpt: 'A blockade on humanitarian aid has led to severe shortages of food, water, and medical supplies, affecting millions of civilians.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Humanitarian',
  },
  {
    id: '3',
    title: 'UN Releases Report on Civilian Casualties',
    source: 'Associated Press',
    date: '2023-10-24',
    excerpt: 'The latest UN report highlights a significant increase in civilian casualties, urging all parties to respect international law.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Conflict',
  },
  {
    id: '4',
    title: 'West Bank Settlements Expand, Drawing Condemnation',
    source: 'The Guardian',
    date: '2023-10-23',
    excerpt: 'Recent expansion of settlements in the West Bank has been met with widespread international condemnation and calls for a halt.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Politics',
  },
  {
    id: '5',
    title: 'Medical Facilities Overwhelmed as Supplies Dwindle',
    source: 'Doctors Without Borders',
    date: '2023-10-22',
    excerpt: 'Hospitals and clinics are struggling to cope with the influx of patients amid a critical shortage of essential medical supplies.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Humanitarian',
  },
  {
    id: '6',
    title: 'Eyewitnesses Recount Airstrikes in Residential Areas',
    source: 'BBC News',
    date: '2023-10-21',
    excerpt: 'Survivors and eyewitnesses have provided harrowing accounts of recent airstrikes that targeted densely populated residential areas.',
    link: '#',
    image: 'https://placehold.co/600x400',
    topic: 'Conflict',
  },
];

export type OfficialReport = {
  id: string;
  title: string;
  source: 'UN' | 'Human Rights Watch' | 'Amnesty International' | 'WHO';
  date: string;
  summary: string;
  link: string;
};

export const officialReports: OfficialReport[] = [
  {
    id: 'rep1',
    title: 'Report of the Special Rapporteur on the situation of human rights',
    source: 'UN',
    date: '2023-09-22',
    summary: 'A comprehensive report detailing the human rights situation in the Palestinian territories occupied since 1967.',
    link: '#',
  },
  {
    id: 'rep2',
    title: 'Gaza: Unlawful Israeli Attacks, Restrictions on Aid',
    source: 'Human Rights Watch',
    date: '2023-08-15',
    summary: 'Investigation into Israeli military actions and their impact on the civilian population and infrastructure in Gaza.',
    link: '#',
  },
  {
    id: 'rep3',
    title: 'Israel’s Apartheid Against Palestinians: A Cruel System of Domination',
    source: 'Amnesty International',
    date: '2023-07-30',
    summary: 'This report examines whether Israel’s treatment of Palestinians amounts to the crime of apartheid under international law.',
    link: '#',
  },
  {
    id: 'rep4',
    title: 'Health access barriers for Palestinians in the West Bank',
    source: 'WHO',
    date: '2023-06-10',
    summary: 'A study on the challenges Palestinians face in accessing essential health services due to checkpoints and other restrictions.',
    link: '#',
  },
];

export const casualtyStats = [
  { name: 'Jan', killed: 30, injured: 90 },
  { name: 'Feb', killed: 45, injured: 120 },
  { name: 'Mar', killed: 80, injured: 250 },
  { name: 'Apr', killed: 120, injured: 340 },
  { name: 'May', killed: 250, injured: 700 },
  { name: 'Jun', killed: 90, injured: 210 },
];

export const casualtySource = 'ochaopt.org/data/casualties';

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
  source: string;
};

export const mediaItems: MediaItem[] = [
  { id: 'm1', type: 'image', src: 'https://placehold.co/600x400', caption: 'A street in Gaza after an airstrike.', source: 'Reuters' },
  { id: 'm2', type: 'image', src: 'https://placehold.co/600x400', caption: 'Children playing amidst rubble.', source: 'AP' },
  { id: 'm3', type: 'image', src: 'https://placehold.co/600x400', caption: 'Humanitarian aid distribution.', source: 'UNRWA' },
  { id: 'm4', type: 'image', src: 'https://placehold.co/600x400', caption: 'A farmer in the West Bank.', source: 'Getty Images' },
  { id: 'm5', type: 'image', src: 'https://placehold.co/600x400', caption: 'Protests in Ramallah.', source: 'AFP' },
  { id: 'm6', type: 'image', src: 'https://placehold.co/600x400', caption: 'A view of the separation wall.', source: 'Human Rights Watch' },
  { id: 'm7', type: 'image', src: 'https://placehold.co/600x400', caption: 'Inside a crowded hospital.', source: 'MSF' },
  { id: 'm8', type: 'image', src: 'https://placehold.co/600x400', caption: 'Sunset over Jerusalem.', source: 'Independent' },
];
