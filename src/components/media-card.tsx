
"use client";
import Image from 'next/image';
import type { MediaItem } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MediaCard({ item }: { item: MediaItem }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use picsum for dynamic sizing to better emulate the masonry effect
  const width = 320;
  const height = Math.floor(Math.random() * (480 - 240 + 1) + 240); // Random height between 240 and 480
  const imageUrl = `https://picsum.photos/seed/${item.id}/${width}/${height}`;

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
          src={imageUrl}
          alt={item.caption}
          width={width}
          height={height}
          className="block max-w-full h-auto"
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
