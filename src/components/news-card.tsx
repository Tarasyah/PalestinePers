"use client";

import Link from 'next/link';
import type { NewsArticleWithReports } from '@/lib/data';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverBorderGradient } from './ui/hover-border-gradient';

const topicColorMap: { [key: string]: string } = {
  "Politics": "bg-blue-500",
  "Humanitarian": "bg-green-500",
  "Conflict": "bg-red-500",
  "International News": "bg-purple-500",
  "Regional News": "bg-indigo-500",
  "Analysis": "bg-yellow-500 text-black",
  "Official News": "bg-gray-500",
};

export const sourceColorMap: { [key: string]: string } = {
    "Al Jazeera": "bg-red-600 text-white",
    "Middle East Eye": "bg-blue-800 text-white",
    "Middle East Monitor": "bg-gray-700 text-white",
    "WAFA News": "bg-green-600 text-white",
    "TRT World": "bg-sky-500 text-white",
    "Reuters": "bg-orange-500 text-white",
};

function getCategoryBadgeClasses(topic: string) {
    return `${topicColorMap[topic] || 'bg-gray-400'} text-white`;
}

function getSourceBadgeClasses(source: string) {
    return `${sourceColorMap[source as keyof typeof sourceColorMap] || 'bg-gray-400'} text-white`;
}


export function NewsCard({ article }: { article: NewsArticleWithReports }) {

  return (
    <HoverBorderGradient
      as="div"
      containerClassName="rounded-lg h-full"
      className="bg-card w-full"
    >
      <Card className="relative flex flex-col h-full overflow-hidden bg-transparent text-card-foreground transition-all duration-300 border-none shadow-none">
        <CardContent className="p-4 flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={getSourceBadgeClasses(article.source)}>{article.source}</Badge>
              <Badge className={getCategoryBadgeClasses(article.category)}>{article.category}</Badge>
              { (article.priority === 'urgent' || article.priority === 'breaking') && 
                  <Badge variant="destructive" className="animate-pulse">{article.priority.toUpperCase()}</Badge>
              }
          </div>
          <CardTitle className="text-lg font-bold leading-tight mb-1">{article.title}</CardTitle>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{article.excerpt}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="secondary">
                  <Link href={article.link} target="_blank">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
          </div>
        </CardFooter>
      </Card>
    </HoverBorderGradient>
  );
}
