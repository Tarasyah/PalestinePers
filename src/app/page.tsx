"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { getNewsArticles, NewsArticleWithReports } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  "Politics": "bg-blue-500 hover:bg-blue-600",
  "Humanitarian": "bg-green-500 hover:bg-green-600",
  "Conflict": "bg-red-500 hover:bg-red-600",
  "International News": "bg-purple-500 hover:bg-purple-600",
  "Regional News": "bg-indigo-500 hover:bg-indigo-600",
  "Analysis": "bg-yellow-500 hover:bg-yellow-600 text-black",
  "Official News": "bg-gray-500 hover:bg-gray-600",
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
        <CardTitle className="text-3xl font-bold tracking-tight text-white">
          Gaza Genocide Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-6 py-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold">{stats.days}</span>
          <span className="text-lg font-light tracking-wider opacity-80">DAYS</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-red-400">{stats.killed}</span>
          <span className="text-lg font-light tracking-wider opacity-80">KILLED</span>
        </div>
         <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold">{stats.wounded}</span>
          <span className="text-lg font-light tracking-wider opacity-80">WOUNDED</span>
        </div>
         <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold">{stats.missing}</span>
          <span className="text-lg font-light tracking-wider opacity-80">MISSING</span>
        </div>
         <div className="text-center opacity-80 pt-4 border-t border-white/20 mt-4">
            <p>Last updated: {stats.lastUpdated}</p>
            <p className="text-sm">
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
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [topicFilter, setTopicFilter] = React.useState("All Topics");

  const fetchArticles = React.useCallback(async () => {
    setLoading(true);
    const fetchedArticles = await getNewsArticles();
    setArticles(fetchedArticles);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = topicFilter === "All Topics" || article.category === topicFilter;
    return matchesSearch && matchesTopic;
  });

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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
               <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Filter by topic:</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
                 <Badge
                    onClick={() => setTopicFilter("All Topics")}
                    className={`cursor-pointer transition-transform hover:scale-105 text-white ${topicFilter === "All Topics" ? 'bg-primary' : 'bg-gray-400 hover:bg-gray-500'}`}
                  >
                    All Topics
                  </Badge>
                {allTopics.slice(1).map((topic) => (
                  <Badge
                    key={topic}
                    onClick={() => setTopicFilter(topic)}
                    className={`cursor-pointer transition-transform hover:scale-105 text-white ${topicColorMap[topic] || 'bg-gray-400'} ${topicFilter === topic ? 'ring-2 ring-offset-2 ring-white' : ''}`}
                  >
                    {topic}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
                  <p className="text-muted-foreground">
                      {loading ? 'Loading articles...' : `${filteredArticles.length} articles from independent sources`}
                  </p>
              </div>
            <Button variant="outline" onClick={fetchArticles} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh News
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                 <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article: NewsArticleWithReports) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 col-span-1 md:col-span-2">
              <p className="text-lg text-muted-foreground">No articles found.</p>
            </div>
          )}
        </div>
        <aside className="lg:col-span-1 space-y-6 pt-16">
          <StatsCard />
        </aside>
      </div>
    </AppLayout>
  );
}
