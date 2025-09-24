// src/app/page.tsx
"use client";

import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { mediaItems } from "@/lib/data";
import type { MediaItem } from "@/lib/data";
import { InteractiveGallery } from '@/components/interactive-gallery';
import { ImageDetail } from '@/components/image-detail';

export default function MediaPage() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleImageSelect = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <AppLayout>
      <div className="relative w-full h-[calc(100vh-10rem)]">
        <InteractiveGallery items={mediaItems} onImageSelect={handleImageSelect} />
        <div className="absolute top-8 left-8 text-foreground z-10 pointer-events-none">
            <h2 className="text-2xl font-bold tracking-tight">A chapter we can never forget</h2>
        </div>
        {selectedItem && (
          <ImageDetail item={selectedItem} onClose={handleClose} />
        )}
      </div>
    </AppLayout>
  );
}
