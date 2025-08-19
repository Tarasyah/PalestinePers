import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function NewsCard({ article }: { article: NewsArticle }) {
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
        <Badge variant={article.topic === 'Politics' ? 'default' : article.topic === 'Humanitarian' ? 'secondary' : 'outline'}>{article.topic}</Badge>
        <Button asChild variant="ghost" size="sm">
          <Link href={article.link}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
