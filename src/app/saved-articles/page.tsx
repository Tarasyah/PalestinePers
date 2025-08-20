"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { NewsCard } from "@/components/news-card";
import { NewsArticleWithReports } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SavedArticlesPage() {
  const [articles, setArticles] = React.useState<NewsArticleWithReports[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchSavedArticles = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: savedArticlesData, error: savedArticlesError } = await supabase
        .from("saved_articles")
        .select("article_id")
        .eq("user_id", user.id);

      if (savedArticlesError) {
        console.error("Error fetching saved articles:", savedArticlesError);
        setLoading(false);
        return;
      }

      const articleIds = savedArticlesData.map((item) => item.article_id);

      if (articleIds.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("*")
        .in("id", articleIds)
        .order("published_at", { ascending: false });

      if (articlesError) {
        console.error("Error fetching article details:", articlesError);
        setArticles([]);
      } else {
         const fetchedArticles = articlesData.map((article: any) => ({
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
        setArticles(fetchedArticles);
      }

      setLoading(false);
    };

    fetchSavedArticles();
  }, [router]);
  
  const handleDeleteArticle = async (articleId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .match({ user_id: user.id, article_id: articleId });
      
    if (error) {
      throw new Error(error.message);
    } else {
      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
    }
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Saved Articles</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} onDelete={handleDeleteArticle} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-800/30 rounded-lg">
            <Bookmark className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Saved Articles Yet</h2>
            <p className="text-gray-400 mb-6">
              Click the bookmark icon on any news story to save it for later.
            </p>
            <Button asChild>
              <Link href="/">Browse News</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
