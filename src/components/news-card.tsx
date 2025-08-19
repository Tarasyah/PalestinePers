import Link from 'next/link';
import type { NewsArticle } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Bookmark, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

export function NewsCard({ article }: { article: NewsArticle }) {
  
  return (
    <Card className="transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={getBadgeVariant(article.topic, 'normal')}>{article.source}</Badge>
                    <Badge variant={topicVariantMap[article.topic] || 'outline'}>{article.topic}</Badge>
                    { (article.priority === 'urgent' || article.priority === 'breaking') && 
                        <Badge variant="destructive">{article.priority}</Badge>
                    }
                </div>
                <h3 className="text-lg font-bold leading-tight mb-1">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{article.excerpt}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
                </div>
            </div>
            <div className="flex flex-col items-start sm:items-end justify-between sm:text-right gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Bookmark</span>
                </Button>
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={article.link} target="_blank">
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
