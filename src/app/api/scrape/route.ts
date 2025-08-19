import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

interface ScrapedArticle {
  title: string;
  link: string;
  summary: string;
  source: string;
  published_at: string;
  category: string;
  image_url?: string;
  priority: 'normal' | 'urgent' | 'breaking';
}

async function scrapeURL(url: string, source: string, category: string, priority: 'normal' | 'urgent' | 'breaking', selector: string, baseUrl: string): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Error fetching ${url}: ${response.statusText}`);
        return [];
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];

    $(selector).each((i, el) => {
      if (i >= 5) return; 

      const title = $(el).text().trim().replace(/&[^;]+;/g, '');
      let link = $(el).attr('href');

      if (title && link && title.length > 10) {
        if (!link.startsWith('http')) {
          link = `${baseUrl}${link}`;
        }
        articles.push({
          title,
          link,
          summary: `${title.substring(0, 100)}...`,
          source,
          published_at: new Date().toISOString(),
          category,
          priority,
        });
      }
    });
    
    console.log(`${source}: Found ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error(`Error scraping ${source}:`, error);
    return [];
  }
}

async function saveArticlesToDatabase(articles: ScrapedArticle[]) {
  for (const article of articles) {
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('link', article.link)
      .single();
    
    if (!existing) {
      const { error } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          link: article.link,
          summary: article.summary,
          source: article.source,
          published_at: article.published_at,
          category: article.category,
          image_url: article.image_url,
          priority: article.priority
        });
      
      if (error) {
        console.error('Error saving article:', error);
      } else {
        console.log('Saved article:', article.title);
      }
    }
  }
}

export async function POST() {
  try {
    console.log('Starting news scraping...');
    
    const sources = [
        { url: 'https://www.aljazeera.com/tag/israel-palestine-conflict/', source: 'Al Jazeera', category: 'International News', priority: 'normal', selector: 'h3.gc__title a', baseUrl: 'https://www.aljazeera.com' },
        { url: 'https://www.middleeasteye.net/live/israel-palestine-war-gaza-live', source: 'Middle East Eye', category: 'Regional News', priority: 'normal', selector: 'h3.card-plat-title a', baseUrl: 'https://www.middleeasteye.net' },
        { url: 'https://www.middleeastmonitor.com/region/middle-east/palestine/', source: 'Middle East Monitor', category: 'Analysis', priority: 'normal', selector: 'h2.item-title a', baseUrl: '' },
        { url: 'https://english.wafa.ps/Pages/Last-News', source: 'WAFA News', category: 'Official News', priority: 'urgent', selector: '.news-title a', baseUrl: 'https://english.wafa.ps' },
        { url: 'https://www.trtworld.com/middle-east', source: 'TRT World', category: 'International News', priority: 'normal', selector: '.article-title a', baseUrl: 'https://www.trtworld.com' },
    ];

    const scrapingPromises = sources.map(s => scrapeURL(s.url, s.source, s.category, s.priority, s.selector, s.baseUrl));

    const results = await Promise.all(scrapingPromises);
    const allArticles = results.flat();
    
    console.log(`Scraped ${allArticles.length} articles total`);
    
    await saveArticlesToDatabase(allArticles);
    
    const sourceCounts = results.reduce((acc, articles, index) => {
        const sourceName = sources[index].source;
        acc[sourceName] = articles.length;
        return acc;
    }, {} as {[key: string]: number});

    return NextResponse.json({ 
        success: true, 
        articlesScraped: allArticles.length,
        sources: sourceCounts
      });

  } catch (error: any) {
    console.error('Error in scrape-news function:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
