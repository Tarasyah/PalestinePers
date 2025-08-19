import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const topicVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' | null | undefined } = {
  'Politics': 'default',
  'Humanitarian': 'secondary',
  'Conflict': 'destructive',
  'Analysis': 'outline',
  'Official News': 'secondary',
  'Regional News': 'outline',
  'International News': 'default',
};

export function NewsCard({ article }: { article: NewsArticle }) {
  const badgeVariant = topicVariantMap[article.topic] || 'default';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint="news article"
            unoptimized
          />
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>{article.source}</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{article.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={badgeVariant}>{article.topic}</Badge>
        <Button asChild variant="ghost" size="sm">
          <Link href={article.link} target="_blank">
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
