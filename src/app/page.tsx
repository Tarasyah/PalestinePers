
import { AppLayout } from "@/components/app-layout";
import { MediaCard } from "@/components/media-card";
import { mediaItems } from "@/lib/data";
import type { MediaItem } from "@/lib/data";

export default function MediaPage() {
  return (
    <AppLayout>
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-center">A chapter we can never forget</h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
                {mediaItems.map((item: MediaItem) => (
                    <MediaCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    </AppLayout>
  );
}
