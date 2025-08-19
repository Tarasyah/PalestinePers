"use client";

import * as React from "react";
import Link from 'next/link';
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { getNewsArticles, NewsArticleWithReports, allSources } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Filter, Search, RefreshCw, ChevronDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";


const allTopics = [
    "All Topics",
    "Politics",
    "Humanitarian",
    "Conflict",
    "International News",
    "Regional News",
    "Analysis",
    "Official News",
];

const topicColorMap: { [key: string]: string } = {
  "All Topics": "bg-gray-400 text-white",
  "Politics": "bg-blue-500 text-white",
  "Humanitarian": "bg-green-500 text-white",
  "Conflict": "bg-red-500 text-white",
  "International News": "bg-purple-500 text-white",
  "Regional News": "bg-indigo-500 text-white",
  "Analysis": "bg-yellow-500 text-black",
  "Official News": "bg-gray-500 text-white",
};

const sourceColorMap: { [key: string]: string } = {
  "All Sources": "bg-gray-400 text-white",
  "Al Jazeera": "bg-red-600 text-white",
  "Middle East Eye": "bg-blue-800 text-white",
  "Middle East Monitor": "bg-gray-700 text-white",
  "WAFA News": "bg-green-600 text-white",
  "TRT World": "bg-sky-500 text-white",
  "Reuters": "bg-orange-500 text-white",
  "UN": "bg-blue-500 text-white",
  "Human Rights Watch": "bg-yellow-500 text-black",
  "Amnesty International": "bg-yellow-400 text-black",
  "WHO": "bg-blue-400 text-white",
};


const stats = {
  days: 681,
  killed: "62,004",
  wounded: "156,230",
  missing: "11,000",
  lastUpdated: "August 18, 2025",
  source: "Euro-Med Human Rights Monitor",
  sourceLink: "https://euromedmonitor.org/en/",
};

function StatsCard() {
  return (
    <Card className="shadow-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white w-full">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold tracking-tight text-white">
          Gaza Genocide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-4">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-red-400">{stats.killed}</span>
          <span className="text-md font-light tracking-wider opacity-80">KILLED</span>
        </div>
         <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">{stats.wounded}</span>
          <span className="text-md font-light tracking-wider opacity-80">WOUNDED</span>
        </div>
         <div className="text-center opacity-80 pt-3 border-t border-white/20 mt-3 text-xs">
            <p>Last updated: {stats.lastUpdated}</p>
            <p>
                Source:{" "}
                <a
                    href={stats.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                >
                    {stats.source}
                </a>
            </p>
         </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [articles, setArticles] = React.useState<NewsArticleWithReports[]>([]);
  const [trendingArticles, setTrendingArticles] = React.useState<NewsArticleWithReports[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isScraping, setIsScraping] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [topicFilter, setTopicFilter] = React.useState("All Topics");
  const [sourceFilter, setSourceFilter] = React.useState("All Sources");
  const { toast } = useToast();

  const fetchArticles = React.useCallback(async () => {
    setLoading(true);
    const fetchedArticles = await getNewsArticles();
    setArticles(fetchedArticles);

    // Separate out Middle East Monitor for trending
    const trending = fetchedArticles
      .filter(a => a.source === 'Middle East Monitor')
      .slice(0, 3);
    setTrendingArticles(trending);

    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleRefreshAndScrape = async () => {
      setIsScraping(true);
      toast({
        title: "Scraping started...",
        description: "Fetching latest articles. This may take a moment.",
      });

      try {
        const response = await fetch("https://pdmrygvnymhwgbvdrpki.supabase.co/functions/v1/scrape-news", { 
          method: "POST",
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong during scraping.");
        }

        toast({
          title: "Scraping Complete",
          description: `Successfully scraped ${data.articlesScraped} articles.`,
        });

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Scraping Failed",
          description: error.message,
        });
      } finally {
        await fetchArticles();
        setIsScraping(false);
      }
    };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = topicFilter === "All Topics" || article.category === topicFilter;
    const matchesSource = sourceFilter === "All Sources" || article.source === sourceFilter;
    return matchesSearch && matchesTopic && matchesSource;
  });
  
  const isRefreshing = loading || isScraping;
  
  const featuredArticle = !loading && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const otherArticles = !loading && filteredArticles.length > 1 ? filteredArticles.slice(1, 7) : [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
                />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto md:flex-row flex-col">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-[200px] justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", topicColorMap[topicFilter])}></span>
                        <span>{topicFilter}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full md:w-[200px]">
                    {allTopics.map((topic) => (
                    <DropdownMenuItem
                        key={topic}
                        onSelect={() => setTopicFilter(topic)}
                        className={cn("flex items-center gap-2", {
                        'font-bold': topicFilter === topic,
                        })}
                    >
                        <span className={cn("w-2 h-2 rounded-full", topicColorMap[topic])}></span>
                        {topic}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-[200px] justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", sourceColorMap[sourceFilter] || 'bg-gray-400 text-white')}></span>
                        <span>{sourceFilter}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full md:w-[200px]">
                    {allSources.map((source) => (
                    <DropdownMenuItem
                        key={source}
                        onSelect={() => setSourceFilter(source)}
                        className={cn("flex items-center gap-2", {
                        'font-bold': sourceFilter === source,
                        })}
                    >
                        <span className={cn("w-2 h-2 rounded-full", sourceColorMap[source] || 'bg-gray-400 text-white')}></span>
                        {source}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Featured Article */}
                {loading ? <Skeleton className="h-[450px] w-full rounded-lg" /> : featuredArticle && (
                    <Card className="overflow-hidden bg-gray-800/60 border border-gray-700 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="grid md:grid-cols-2">
                            <div className="relative h-64 md:h-auto">
                                <Image
                                    src={featuredArticle.image || `https://placehold.co/600x400.png?text=${encodeURIComponent(featuredArticle.source)}`}
                                    alt={featuredArticle.title}
                                    layout="fill"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            </div>
                            <div className="p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <Badge className={cn(sourceColorMap[featuredArticle.source] || 'bg-gray-400', "text-white")}>{featuredArticle.source}</Badge>
                                        <Badge className={cn(topicColorMap[featuredArticle.category] || 'bg-gray-400', "text-white")}>{featuredArticle.category}</Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-bold mb-2 text-white">
                                        <Link href={featuredArticle.link} target="_blank" className="hover:underline">{featuredArticle.title}</Link>
                                    </CardTitle>
                                    <p className="text-gray-300 line-clamp-4 mb-4">{featuredArticle.excerpt}</p>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(featuredArticle.date), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Article Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[350px] w-full rounded-lg" />)}
                    </div>
                ) : otherArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherArticles.map((article) => <NewsCard key={article.id} article={article} />)}
                    </div>
                ) : (
                    !loading && <p className="text-center col-span-full">No more articles found.</p>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-8">
                <StatsCard />
                
                {/* Trending News */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Trending News
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {loading ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />) :
                        trendingArticles.map(article => (
                            <Link key={article.id} href={article.link} target="_blank" className="block hover:bg-white/5 p-2 rounded-md transition-colors">
                                <h4 className="font-semibold text-sm leading-tight line-clamp-2">{article.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</p>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                 <div className="flex justify-center">
                    <Button variant="outline" onClick={handleRefreshAndScrape} disabled={isRefreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isScraping ? 'Scraping...' : 'Refresh News'}
                    </Button>
                </div>
            </aside>
        </div>
      </div>
    </AppLayout>
  );
}
