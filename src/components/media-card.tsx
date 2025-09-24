
"use client";
import Image from 'next/image';
import type { MediaItem } from '@/lib/data';

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a 
      href={item.src} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block effect effect-ten group"
    >
      <figure className="relative overflow-hidden">
        <Image
          src={item.src}
          alt={item.caption}
          width={400}
          height={400}
          className="block max-w-full h-auto object-cover transition-all duration-500 transform-gpu group-hover:scale-100 group-hover:translate-x-0 group-hover:opacity-85 -translate-x-5 scale-110"
          data-ai-hint="photojournalism palestine"
        />
        <div className="absolute inset-0 p-4 text-white tab-text overflow-hidden">
          <figcaption className="relative z-10 h-full flex flex-col justify-center items-center text-center">
            <h2 className="text-lg font-bold transition-transform duration-500 transform-gpu translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption.split(',')[0]}
            </h2>
            <p className="text-sm transition-transform duration-500 transform-gpu translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </p>
          </figcaption>
        </div>
      </figure>
    </a>
  );
}
