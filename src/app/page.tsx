
import { AppLayout } from "@/components/app-layout";
import CasualtiesOverTime from "@/components/charts/casualties-over-time";
import CasualtySummary from "@/components/charts/casualty-summary";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <CasualtySummary />
        <CasualtiesOverTime />
      </div>
    </AppLayout>
  );
}
