import { AppLayout } from "@/components/app-layout";
import { CasualtyChart } from "@/components/charts/CasualtyChart";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center py-8">
        <CasualtyChart />
      </div>
    </AppLayout>
  );
}
