"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { getNewsArticles } from "@/lib/data";
import type { NewsArticle } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, RefreshCw, RadioTower } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchArticles = React.useCallback(async () => {
    setLoading(true);
    const fetchedArticles = await getNewsArticles();
    setArticles(fetchedArticles);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
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
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white">
                <RadioTower className="mr-2 h-4 w-4" />
                Live Updates
              </Button>
            </div>
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
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
               <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-4">
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
