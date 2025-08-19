import Link from 'next/link';
import type { NewsArticleWithReports } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Bookmark, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

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


export function NewsCard({ article }: { article: NewsArticleWithReports }) {
  const imageUrl = article.image || `https://placehold.co/600x400.png?text=${encodeURIComponent(article.title)}`;
  
  return (
    <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col bg-gray-800/60 border border-gray-700 text-white">
      {article.image && (
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image 
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="news article"
              onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400.png?text=${encodeURIComponent(article.title)}` }}
            />
          </div>
        </CardHeader>
      )}
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
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Bookmark</span>
            </Button>
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
