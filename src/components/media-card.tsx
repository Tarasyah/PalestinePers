
"use client";
import Image from 'next/image';
import type { MediaItem } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MediaCard({ item }: { item: MediaItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={item.src} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block gallery-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="gallery-image group">
        <Image
          src={item.src}
          alt={item.caption}
          width={400}
          height={400}
          className="block max-w-full h-auto w-full object-cover"
          data-ai-hint="photojournalism palestine"
        />
        <figcaption 
          className={cn(
            "gallery-image-caption",
            {"gallery-image-caption-visible": isHovered }
          )}
        >
          {item.caption}
        </figcaption>
      </figure>
    </a>
  );
}
