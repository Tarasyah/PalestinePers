"use client";

import * as React from "react";
import Link from 'next/link';
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { getNewsArticles, NewsArticleWithReports, allSources } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import GazaTracker from "@/components/gaza-tracker";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";


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

export default function Home() {
  const [articles, setArticles] = React.useState<NewsArticleWithReports[]>([]);
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
  const otherArticles = !loading && filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
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

          <div className="space-y-8">
              {/* Featured Article */}
              {loading ? <Skeleton className="h-[250px] w-full rounded-lg" /> : featuredArticle && (
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-lg"
                  className="bg-transparent"
                >
                  <Card className="overflow-hidden bg-transparent text-white shadow-xl transition-shadow duration-300 border-none">
                      <div className="grid">
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
                </HoverBorderGradient>
              )}

              {/* Article Grid */}
              {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[280px] w-full rounded-lg" />)}
                  </div>
              ) : otherArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {otherArticles.map((article) => <NewsCard key={article.id} article={article} />)}
                  </div>
              ) : (
                  !loading && <p className="text-center col-span-full">No more articles found.</p>
              )}
              
              <div className="flex justify-center pt-8">
                  <Button variant="outline" onClick={handleRefreshAndScrape} disabled={isRefreshing}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isScraping ? 'Scraping...' : 'Refresh News'}
                  </Button>
              </div>
          </div>
        </div>
        <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
          <Card className="p-4 bg-card rounded-lg border shadow-sm">
            <GazaTracker />
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}
