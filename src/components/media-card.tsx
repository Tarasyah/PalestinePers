
"use client";
import Image from 'next/image';
import type { MediaItem } from '@/lib/data';

export function MediaCard({ item }: { item: MediaItem }) {

  return (
    <figure className="hover-img">
      <Image
        src={item.src}
        alt={item.caption}
        width={320}
        height={240}
        className="object-cover w-full h-auto"
        data-ai-hint="photojournalism palestine"
      />
      <figcaption>
        <p>{item.caption}</p>
      </figcaption>
    </figure>
  );
}
