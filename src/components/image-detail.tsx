// src/components/image-detail.tsx
import React from 'react';
import type { MediaItem } from '@/lib/data';
import Image from 'next/image';

interface ImageDetailProps {
  item: MediaItem;
  onClose: () => void;
}

export function ImageDetail({ item, onClose }: ImageDetailProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-detail-overlay" onClick={handleOverlayClick}>
      <div className="image-detail-content">
        <Image
          src={item.src}
          alt={item.caption}
          width={800}
          height={600}
          style={{ 
            maxWidth: '90vw', 
            maxHeight: '80vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: 'var(--radius)'
          }}
        />
        <div className="image-detail-caption">
          <p>{item.caption}</p>
        </div>
      </div>
    </div>
  );
}
