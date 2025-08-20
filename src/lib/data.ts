import { supabase } from "./supabase";

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  link: string;
  image?: string;
  category: string;
  priority: 'normal' | 'urgent' | 'breaking';
};

export type OfficialReport = {
  id: string;
  title: string;
  source: 'UN' | 'Human Rights Watch' | 'Amnesty International' | 'WHO';
  date: string;
  summary: string;
  link: string;
};

// This type will be used in the front-end to handle both articles and reports
export type NewsArticleWithReports = NewsArticle;

export async function getNewsArticles(): Promise<NewsArticleWithReports[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, source, published_at, summary, link, image_url, category, priority')
    .order('published_at', { ascending: false });

  if (error) {
    // console.error('Error fetching articles:', error);
    return [];
  }

  const articles = data.map((article: any) => ({
    id: article.id,
    title: article.title,
    source: article.source,
    date: article.published_at,
    excerpt: article.summary,
    link: article.link,
    image: article.image_url,
    category: article.category,
    priority: article.priority
  }));
  
  return articles;
}

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


export const allSources = [
  "All Sources",
  "Al Jazeera",
  "Middle East Eye",
  "Middle East Monitor",
  "WAFA News",
  "TRT World",
  "Reuters",
  "UN",
  "Human Rights Watch",
  "Amnesty International",
  "WHO",
  "Official News"
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
  { id: 'm1', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'A street in Gaza after an airstrike.', source: 'Reuters' },
  { id: 'm2', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'Children playing amidst rubble.', source: 'AP' },
  { id: 'm3', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'Humanitarian aid distribution.', source: 'UNRWA' },
  { id: 'm4', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'A farmer in the West Bank.', source: 'Getty Images' },
  { id: 'm5', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'Protests in Ramallah.', source: 'AFP' },
  { id: 'm6', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'A view of the separation wall.', source: 'Human Rights Watch' },
  { id: 'm7', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'Inside a crowded hospital.', source: 'MSF' },
  { id: 'm8', type: 'image', src: 'https://placehold.co/600x400.png', caption: 'Sunset over Jerusalem.', source: 'Independent' },
];
