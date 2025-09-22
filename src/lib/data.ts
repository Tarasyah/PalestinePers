

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

// New types for the dashboard data from techforpalestine.org
export interface SummaryData {
  killed: {
    total: number;
    women: number;
    children: number;
    press: number;
    civil_defence: number;
    health_workers: number;
    un_staff: number;
    foreigners: number;
  };
  injured: {
    total: number;
  };
  last_update: string; // ISO 8601 date string
}

export interface DailyCasualtyEntry {
  report_date: string; // "YYYY-MM-DD"
  killed_total: number;
  injured_total: number;
  killed_daily: number;
  injured_daily: number;
}

export interface ChildNameCount {
  name: string;
  count: number;
}

export interface PressKilled {
    name: string;
    date_of_death: string;
    gender: string;
    type: string; // Journalist, Media Worker, etc.
    nationality: string;
    location: string;
    source_link: string;
}

export interface InfrastructureDamage {
    report_date: string;
    residential: number;
    health: number;
    education: number;
    religious: number;
    'govt buildings': number;
}


const mockArticles: NewsArticleWithReports[] = [
    {
        id: '1',
        title: 'Israel continues its assault on Gaza, with no ceasefire in sight',
        source: 'Al Jazeera',
        date: new Date(Date.now() - 3600000).toISOString(),
        excerpt: 'Israeli forces have launched new airstrikes on Gaza, hitting residential buildings and causing civilian casualties. International calls for a ceasefire have so far been ignored.',
        link: '#',
        category: 'Conflict',
        priority: 'breaking'
    },
    {
        id: '2',
        title: 'Humanitarian crisis deepens in Gaza as aid is blocked',
        source: 'Middle East Eye',
        date: new Date(Date.now() - 7200000).toISOString(),
        excerpt: 'Aid organizations warn of a catastrophic humanitarian situation in Gaza as essential supplies like food, water, and medicine are unable to enter the besieged enclave.',
        link: '#',
        category: 'Humanitarian',
        priority: 'urgent'
    },
    {
        id: '3',
        title: 'UN calls for investigation into war crimes in Palestine',
        source: 'WAFA News',
        date: new Date(Date.now() - 10800000).toISOString(),
        excerpt: 'The United Nations Human Rights Council has passed a resolution to launch an independent investigation into alleged war crimes committed in the recent conflict.',
        link: '#',
        category: 'Politics',
        priority: 'normal'
    },
    {
        id: '4',
        title: 'Regional powers meet to discuss de-escalation',
        source: 'Reuters',
        date: new Date(Date.now() - 21600000).toISOString(),
        excerpt: 'Leaders from several Middle Eastern countries are holding an emergency summit to find a diplomatic solution and de-escalate the conflict.',
        link: '#',
        category: 'Regional News',
        priority: 'normal'
    },
    {
        id: '5',
        title: 'Analysis: The shifting dynamics of the Israeli-Palestinian conflict',
        source: 'Middle East Monitor',
        date: new Date(Date.now() - 43200000).toISOString(),
        excerpt: 'Experts analyze the long-term implications of the latest round of violence and what it means for the future of the region and the two-state solution.',
        link: '#',
        category: 'Analysis',
        priority: 'normal'
    },
     {
        id: '6',
        title: '‘Moral imperative’: Hundreds of business leaders demand UK action on Israel',
        source: 'Al Jazeera',
        date: '2024-08-22T14:00:00.000Z',
        excerpt: '‘Moral imperative’: Hundreds of business leaders demand UK action on Israel...',
        link: 'https://www.aljazeera.com/news/2024/7/24/moral-imperative-hundreds-of-business-leaders-demand-uk-action-on-israel',
        image: 'https://www.aljazeera.com/wp-content/uploads/2024/07/Office-of-Justin-Welby-1721821035.jpg?resize=770%2C513&quality=80',
        category: 'International News',
        priority: 'normal'
    },
];

export async function getNewsArticles(): Promise<NewsArticleWithReports[]> {
  console.log("Fetching mock articles...");
  // Return mock data instead of fetching from Supabase
  return Promise.resolve(mockArticles);
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
};

export const mediaItems: MediaItem[] = [
 {
 id: 'm1',
 type: 'image',
 src: '/images/A Palestinian family displaced from Beit Hanoun, Gaza, shares a meal of bulgur wheat in Gaza City on May 24.webp',
    caption: 'A Palestinian family displaced from Beit Hanoun, Gaza, shares a meal of bulgur wheat in Gaza City on May 24'
  },
 {
 id: 'm2',
 type: 'image',
 src: '/images/A Palestinian girl suffering from malnutrition has her arm circumference measured while receiving treatment at the Patient Friends Association Hospital in Gaza City on July 22.webp',
    caption: 'A Palestinian girl suffering from malnutrition has her arm circumference measured while receiving treatment at the Patient Friends Association Hospital in Gaza City on July 22'
  },
 {
 id: 'm3',
 type: 'image',
 src: '/images/A boy fills plastic containers with water to carry to his family in the Jabalya camp in Gaza on April 24. There is little clean water available in Gaza, so people often dig for whatever water they can find.webp',
    caption: 'A boy fills plastic containers with water to carry to his family in the Jabalya camp in Gaza on April 24. There is little clean water available in Gaza, so people often dig for whatever water they can find'
  },
 {
 id: 'm4',
 type: 'image',
 src: '/images/A displaced Palestinian girl takes a sip of lentil soup that she received at a food distribution point in Gaza City on July 25.webp',
    caption: 'A displaced Palestinian girl takes a sip of lentil soup that she received at a food distribution point in Gaza City on July 25'
  },
 {
 id: 'm5',
 type: 'image',
 src: '/images/A displaced Palestinian woman cooks amid ongoing food shortages in Gaza on July 28.webp',
    caption: 'A displaced Palestinian woman cooks amid ongoing food shortages in Gaza on July 28'
  },
 {
 id: 'm6',
 type: 'image',
 src: '/images/A woman prepares bread over a fire due to the lack of cooking gas in Gaza on April 23.webp',
    caption: 'A woman prepares bread over a fire due to the lack of cooking gas in Gaza on April 23'
  },
 {
 id: 'm7',
 type: 'image',
 src: '/images/Alaa Al-Najjar mourns her 3-month-old baby, Yehia, at the Nasser Hospital in Khan Younis on July 20. Medics said Yehia died from malnutrition.webp',
    caption: 'Alaa Al-Najjar mourns her 3-month-old baby, Yehia, at the Nasser Hospital in Khan Younis on July 20. Medics said Yehia died from malnutrition'
  },
 {
 id: 'm8',
 type: 'image',
 src: '/images/An airplane drops humanitarian aid over Gaza on July 27. The head of the United Nations agency for Palestinian refugees called the drops a “distraction,” saying they will do little to alleviate suffering in the enc.webp',
    caption: 'An airplane drops humanitarian aid over Gaza on July 27. The head of the United Nations agency for Palestinian refugees called the drops a “distraction,” saying they will do little to alleviate suffering in the enc'
  },
 {
 id: 'm9',
 type: 'image',
 src: '/images/Crowds form in Gaza City as Palestinians wait to receive food distributed by a charity on July 22.webp',
    caption: 'Crowds form in Gaza City as Palestinians wait to receive food distributed by a charity on July 22'
  },
  {
 id: 'm10',
 type: 'image',
 src: '/images/Humanitarian aid is dropped over Gaza City on July 27.webp',
    caption: 'Humanitarian aid is dropped over Gaza City on July 27'
  },
  {
 id: 'm11',
 type: 'image',
 src: '/images/Hundreds of Palestinians wait in line for hours in the scorching heat to receive food aid at the Nuseirat Camp in Gaza on July 25.webp',
    caption: 'Hundreds of Palestinians wait in line for hours in the scorching heat to receive food aid at the Nuseirat Camp in Gaza on July 25'
  },
  {
 id: 'm12',
 type: 'image',
 src: '/images/Mohammed al-Mutawaq, an 18-month-old Palestinian boy with medical issues and signs of malnutrition, lies on a mattress inside a tent at the Al-Shati refugee camp west of Gaza City on July 25.webp',
    caption: 'Mohammed al-Mutawaq, an 18-month-old Palestinian boy with medical issues and signs of malnutrition, lies on a mattress inside a tent at the Al-Shati refugee camp west of Gaza City on July 25'
  },
  {
 id: 'm13',
 type: 'image',
 src: '/images/Mosab Al-Debs, a 14-year-old Palestinian boy who is suffering from malnourishment, lies on a bed at the Al-Shifa Hospital in Gaza City on July 22.webp',
    caption: 'Mosab Al-Debs, a 14-year-old Palestinian boy who is suffering from malnourishment, lies on a bed at the Al-Shifa Hospital in Gaza City on July 22'
  },
  {
 id: 'm14',
 type: 'image',
 src: '/images/Muhammad Zakariya Ayyoub al-Matouq, a child in Gaza City, is held on July 21_jpg.webp',
    caption: 'Muhammad Zakariya Ayyoub al-Matouq, a child in Gaza City, is held on July 21_jpg'
  },
  {
 id: 'm15',
 type: 'image',
 src: '/images/Najwa Hussein Hajjaj, 6, is suffering from severe malnutrition in Gaza City.webp',
    caption: 'Najwa Hussein Hajjaj, 6, is suffering from severe malnutrition in Gaza City'
  },
  {
 id: 'm16',
 type: 'image',
 src: '/images/Palestinian families and journalists gather in Gaza City on July 19 to demand an end to Israeli attacks and the entry of humanitarian aid..webp',
    caption: 'Palestinian families and journalists gather in Gaza City on July 19 to demand an end to Israeli attacks and the entry of humanitarian aid.'
  },
  {
 id: 'm17',
 type: 'image',
 src: '/images/Palestinians carry parcels of donated food they obtained at a distribution point northwest of Gaza City on June 16..webp',
    caption: 'Palestinians carry parcels of donated food they obtained at a distribution point northwest of Gaza City on June 16.'
  },
  {
 id: 'm18',
 type: 'image',
 src: '/images/Palestinians carry sacks of flour unloaded from a humanitarian aid convoy that reached Gaza City on July 27..webp',
    caption: 'Palestinians carry sacks of flour unloaded from a humanitarian aid convoy that reached Gaza City on July 27.'
  },
  {
 id: 'm19',
 type: 'image',
 src: '/images/Palestinians gather for aid in Beit Lahia, Gaza, on June 17..webp',
    caption: 'Palestinians gather for aid in Beit Lahia, Gaza, on June 17.'
  },
  {
 id: 'm20',
 type: 'image',
 src: '/images/Palestinians grieve for their dead relatives outside the Al-Shifa Hospital in Gaza City on July 20. At least 73 people were killed and around 150 people injured by Israeli gunfire in Gaza while seeking aid that day..webp',
    caption: 'Palestinians grieve for their dead relatives outside the Al-Shifa Hospital in Gaza City on July 20. At least 73 people were killed and around 150 people injured by Israeli gunfire in Gaza while seeking aid that day.'
  },
  {
 id: 'm21',
 type: 'image',
 src: '/images/Palestinians hurry toward a distribution point northwest of Gaza City as humanitarian aid arrives on June 16. A convoy of trucks brought food parcels into the territory..webp',
    caption: 'Palestinians hurry toward a distribution point northwest of Gaza City as humanitarian aid arrives on June 16. A convoy of trucks brought food parcels into the territory.'
  },
  {
 id: 'm22',
 type: 'image',
 src: '/images/Palestinians rush to line up at a charity kitchen in Khan Younis on July 22..webp',
    caption: 'Palestinians rush to line up at a charity kitchen in Khan Younis on July 22.'
  },
  {
 id: 'm23',
 type: 'image',
 src: '/images/Palestinians wait for food that was distributed by a charity organization in Gaza City on July 25..webp',
    caption: 'Palestinians wait for food that was distributed by a charity organization in Gaza City on July 25.'
  },
  {
 id: 'm24',
 type: 'image',
 src: '/images/Palestinians walk with sacks of flour after trucks carrying humanitarian aid entered northern Gaza from the Zikim border crossing on July 27..webp',
    caption: 'Palestinians walk with sacks of flour after trucks carrying humanitarian aid entered northern Gaza from the Zikim border crossing on July 27.'
  },
  {
 id: 'm25',
 type: 'image',
 src: '/images/Parcels of humanitarian aid await transfer on the Gaza side of the Kerem Shalom crossing on July 24..webp',
    caption: 'Parcels of humanitarian aid await transfer on the Gaza side of the Kerem Shalom crossing on July 24.'
  },
  {
 id: 'm26',
 type: 'image',
 src: '/images/People seeking aid from the US-backed Gaza Humanitarian Foundation carry bags near Rafah, Gaza, on July 24..webp',
    caption: 'People seeking aid from the US-backed Gaza Humanitarian Foundation carry bags near Rafah, Gaza, on July 24.'
  },
  {
 id: 'm27',
 type: 'image',
 src: '/images/Samah Matar holds her malnourished son Ameer, who has cerebral palsy, at a school where their family is taking shelter in Gaza City on July 24..webp',
    caption: 'Samah Matar holds her malnourished son Ameer, who has cerebral palsy, at a school where their family is taking shelter in Gaza City on July 24.'
  },
  {
 id: 'm28',
 type: 'image',
 src: '/images/Yazan, a malnourished 2-year-old, stands in his family’s damaged home in the Al-Shati refugee camp west of Gaza City on July 23..webp',
    caption: 'Yazan, a malnourished 2-year-old, stands in his family’s damaged home in the Al-Shati refugee camp west of Gaza City on July 23.'
  },
  {
 id: 'm29',
 type: 'image',
 src: '/images/Young Palestinians wait for a charity organization to distribute food in Gaza City on July 24..webp',
    caption: 'Young Palestinians wait for a charity organization to distribute food in Gaza City on July 24.'
  },
];


