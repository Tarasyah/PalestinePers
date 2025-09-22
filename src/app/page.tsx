
import { AppLayout } from "@/components/app-layout";
import CasualtiesOverTime from "@/components/charts/casualties-over-time";
import CasualtySummary from "@/components/charts/casualty-summary";
import InfrastructureDamageChart from "@/components/charts/infrastructure-damage-chart";
import KilledChildrenNames from "@/components/charts/killed-children-names";
import PressKilledTable from "@/components/charts/press-killed-table";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <CasualtySummary />
        <div className="grid gap-8 md:grid-cols-2">
            <KilledChildrenNames />
            <PressKilledTable />
        </div>
        <CasualtiesOverTime />
        <InfrastructureDamageChart />
      </div>
    </AppLayout>
  );
}
