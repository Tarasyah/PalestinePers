
"use client";

import { MediaCard } from "@/components/media-card";
import type { MediaItem } from "@/lib/data";

export function MediaGallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {items.map((item: MediaItem) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
