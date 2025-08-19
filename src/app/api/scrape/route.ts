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

async function scrapeURL(url: string, source: string, category: string, priority: 'normal' | 'urgent' | 'breaking', itemSelector: string, titleSelector: string, linkSelector: string, imageSelector: string, imageAttr: string, baseUrl: string): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Error fetching ${url}: ${response.statusText}`);
        return [];
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];

    $(itemSelector).each((i, el) => {
      if (i >= 5) return; 

      const title = $(el).find(titleSelector).text().trim().replace(/&[^;]+;/g, '');
      let link = $(el).find(linkSelector).attr('href');
      let imageUrl = $(el).find(imageSelector).attr(imageAttr);

      if (title && link && title.length > 10) {
        if (link && !link.startsWith('http')) {
          link = `${baseUrl}${link}`;
        }
         if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${baseUrl}${imageUrl}`;
        }
        articles.push({
          title,
          link,
          summary: `${title.substring(0, 150)}...`,
          source,
          published_at: new Date().toISOString(),
          category,
          image_url: imageUrl,
          priority,
        });
      }
    });
    
    console.log(`${source}: Found ${articles.length} articles from ${url}`);
    return articles;
  } catch (error) {
    console.error(`Error scraping ${source}:`, error);
    return [];
  }
}

async function saveArticlesToDatabase(articles: ScrapedArticle[]) {
  if (articles.length === 0) return;

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
        console.error('Error saving article:', error.message);
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
        { url: 'https://www.aljazeera.com/palestine/', source: 'Al Jazeera', category: 'International News', priority: 'normal', itemSelector: 'article.gc', titleSelector: 'h3.gc__title a span', linkSelector: 'h3.gc__title a', imageSelector: 'div.gc__image-container img', imageAttr: 'src', baseUrl: 'https://www.aljazeera.com' },
        { url: 'https://www.middleeasteye.net/news/israel-palestine', source: 'Middle East Eye', category: 'Regional News', priority: 'normal', itemSelector: 'div.views-row', titleSelector: 'h2 a', linkSelector: 'h2 a', imageSelector: '.field-content a img', imageAttr: 'src', baseUrl: 'https://www.middleeasteye.net' },
        { url: 'https://www.middleeastmonitor.com/section/palestine/', source: 'Middle East Monitor', category: 'Analysis', priority: 'normal', itemSelector: 'div.category-article-item', titleSelector: 'h3.title a', linkSelector: 'h3.title a', imageSelector: 'div.image-wrapper a img', imageAttr: 'src', baseUrl: '' },
        { url: 'https://english.wafa.ps/Pages/Last-News', source: 'WAFA News', category: 'Official News', priority: 'urgent', itemSelector: '.row.news-box', titleSelector: '.news-title a', linkSelector: '.news-title a', imageSelector: '.news-img-container img', imageAttr: 'src', baseUrl: 'https://english.wafa.ps' },
        { url: 'https://www.trtworld.com/middle-east', source: 'TRT World', category: 'International News', priority: 'normal', itemSelector: '.listing-item', titleSelector: '.article-title a', linkSelector: '.article-title a', imageSelector: '.article-image img', imageAttr: 'data-src', baseUrl: 'https://www.trtworld.com' },
        { url: 'https://www.reuters.com/world/israel-hamas/', source: 'Reuters', category: 'International News', priority: 'normal', itemSelector: 'li[data-testid="StoryList-story-item"]', titleSelector: 'a[data-testid="StoryCard-title"]', linkSelector: 'a[data-testid="StoryCard-title"]', imageSelector: 'img', imageAttr: 'src', baseUrl: 'https://www.reuters.com' },

    ];

    const scrapingPromises = sources.map(s => scrapeURL(s.url, s.source, s.category, s.priority, s.itemSelector, s.titleSelector, s.linkSelector, s.imageSelector, s.imageAttr, s.baseUrl));

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
