
import { AppLayout } from "@/components/app-layout";
import { mediaItems } from "@/lib/data";
import { MediaGallery } from "@/components/media-gallery";

export default function MediaPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-center">A chapter we can never forget</h2>
        <MediaGallery items={mediaItems} />
      </div>
    </AppLayout>
  );
}
