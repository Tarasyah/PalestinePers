"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { getNewsArticles } from "@/lib/data";
import type { NewsArticle } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("All Sources");
  const [topicFilter, setTopicFilter] = React.useState("All Topics");

  React.useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const fetchedArticles = await getNewsArticles();
      setArticles(fetchedArticles);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const sources = ["All Sources", ...Array.from(new Set(articles.map((a) => a.source)))];
  const topics = ["All Topics", ...Array.from(new Set(articles.map((a) => a.topic)))];

  const filteredArticles = articles
    .filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((article) =>
      sourceFilter === "All Sources" ? true : article.source === sourceFilter
    )
    .filter((article) =>
      topicFilter === "All Topics" ? true : article.topic === topicFilter
    );

  return (
    <AppLayout pageTitle="Main News Feed">
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            <Select onValueChange={setSourceFilter} defaultValue={sourceFilter} disabled={loading}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setTopicFilter} defaultValue={topicFilter} disabled={loading}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map((article: NewsArticle) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
