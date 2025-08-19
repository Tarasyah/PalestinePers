import Link from 'next/link';
import type { NewsArticleWithReports } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Bookmark, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

const topicVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' | null | undefined } = {
  'Politics': 'default',
  'Humanitarian': 'secondary',
  'Conflict': 'destructive',
  'Analysis': 'outline',
  'Official News': 'secondary',
  'Regional News': 'outline',
  'International News': 'default',
  'urgent': 'destructive',
  'normal': 'secondary',
  'breaking': 'destructive'
};

function getBadgeVariant(topic: string, priority: string) {
    if (priority === 'urgent' || priority === 'breaking') {
        return 'destructive';
    }
    return topicVariantMap[topic] || 'default';
}

export function NewsCard({ article }: { article: NewsArticleWithReports }) {
  
  return (
    <Card className="transition-shadow duration-300 hover:shadow-xl flex flex-col">
      {article.image && (
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image 
              src={article.image}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="news article"
            />
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getBadgeVariant(article.topic, 'normal')}>{article.source}</Badge>
            <Badge variant={topicVariantMap[article.topic] || 'outline'}>{article.topic}</Badge>
            { (article.priority === 'urgent' || article.priority === 'breaking') && 
                <Badge variant="destructive">{article.priority}</Badge>
            }
        </div>
        <CardTitle className="text-lg font-bold leading-tight mb-1">{article.title}</CardTitle>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{article.excerpt}</p>
      </CardContent>
       <CardFooter className="p-4 pt-0 flex justify-between items-center">
         <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Bookmark</span>
            </Button>
            <Button asChild size="sm">
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
