"use client";

import Link from 'next/link';
import type { NewsArticleWithReports } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Bookmark, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const topicColorMap: { [key: string]: string } = {
  "Politics": "bg-blue-500",
  "Humanitarian": "bg-green-500",
  "Conflict": "bg-red-500",
  "International News": "bg-purple-500",
  "Regional News": "bg-indigo-500",
  "Analysis": "bg-yellow-500 text-black",
  "Official News": "bg-gray-500",
};

const sourceColorMap: { [key: string]: string } = {
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

function getCategoryBadgeClasses(topic: string) {
    return `${topicColorMap[topic] || 'bg-gray-400'} text-white`;
}

function getSourceBadgeClasses(source: string) {
    return `${sourceColorMap[source] || 'bg-gray-400'} text-white`;
}


export function NewsCard({ article, onDelete }: { article: NewsArticleWithReports, onDelete?: (articleId: string) => void }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveArticle = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save articles.",
      });
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('saved_articles')
      .insert({ user_id: user.id, article_id: article.id });

    if (error) {
       if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already Saved",
          description: "This article is already in your saved list.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: error.message,
        });
      }
    } else {
      toast({
        title: "Article Saved",
        description: "You can find it in your 'Saved Articles' list.",
      });
    }
    setIsSaving(false);
  };
  
  const handleDeleteClick = async () => {
    if (onDelete) {
        setIsDeleting(true);
        try {
            await onDelete(article.id);
            toast({
                title: "Article Removed",
                description: "The article has been removed from your saved list.",
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error.message || "Could not remove the article.",
            });
        } finally {
            setIsDeleting(false);
        }
    }
  }

  return (
    <Card className={cn(
        "group/card relative flex flex-col overflow-hidden bg-gray-800/60 text-white transition-all duration-300",
        "before:pointer-events-none before:absolute before:-inset-px before:z-10 before:hidden before:rounded-lg before:bg-glow before:opacity-0 before:transition-opacity before:duration-300 hover:before:block hover:before:opacity-100"
      )}>
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={getSourceBadgeClasses(article.source)}>{article.source}</Badge>
            <Badge className={getCategoryBadgeClasses(article.category)}>{article.category}</Badge>
            { (article.priority === 'urgent' || article.priority === 'breaking') && 
                <Badge variant="destructive" className="animate-pulse">{article.priority.toUpperCase()}</Badge>
            }
        </div>
        <CardTitle className="text-lg font-bold leading-tight mb-1">{article.title}</CardTitle>
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
      </CardContent>
       <CardFooter className="p-4 pt-0 flex justify-between items-center">
         <div className="flex items-center text-xs text-gray-400">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
            {onDelete ? (
                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={handleDeleteClick} disabled={isDeleting}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Delete</span>
                </Button>
            ) : (
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400" onClick={handleSaveArticle} disabled={isSaving}>
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Bookmark</span>
                </Button>
            )}
            <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <Link href={article.link} target="_blank">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
