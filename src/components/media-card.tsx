
"use client";
import Image from 'next/image';
import type { MediaItem } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function MediaCard({ item }: { item: MediaItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageHeight, setImageHeight] = useState(300); // Default height

  useEffect(() => {
    // Calculate random height only on the client-side
    const randomHeight = Math.floor(Math.random() * (480 - 240 + 1) + 240);
    setImageHeight(randomHeight);
  }, []); // Empty dependency array ensures this runs once on mount

  const width = 320;
  const imageUrl = `https://picsum.photos/seed/${item.id}/${width}/${imageHeight}`;

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
          height={imageHeight}
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
