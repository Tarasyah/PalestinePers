import Image from 'next/image';
import type { MediaItem } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={item.src}
            alt={item.caption}
            width={400}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="photojournalism palestine"
          />
        </div>
      </CardContent>
      <CardFooter className="p-3">
        <div>
          <p className="text-sm font-medium">{item.caption}</p>
          <p className="text-xs text-muted-foreground">{item.source}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
