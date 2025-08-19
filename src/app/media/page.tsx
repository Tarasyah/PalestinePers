import { AppLayout } from "@/components/app-layout";
import { MediaCard } from "@/components/media-card";
import { mediaItems } from "@/lib/data";
import type { MediaItem } from "@/lib/data";

export default function MediaPage() {
  return (
    <AppLayout>
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Media Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaItems.map((item: MediaItem) => (
                <MediaCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    </AppLayout>
  );
}
