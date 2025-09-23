import { AppLayout } from "@/components/app-layout";
import CasualtiesOverTime from "@/components/charts/casualties-over-time";
import CasualtySummary from "@/components/charts/casualty-summary";
import HumanTollChart from "@/components/charts/human-toll-chart";
import InfrastructureDamageChart from "@/components/charts/infrastructure-damage-chart";
import KilledChildrenNames from "@/components/charts/killed-children-names";
import VictimsTable from "@/components/charts/press-killed-table";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <HumanTollChart />
        <CasualtySummary />
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <KilledChildrenNames />
            <VictimsTable />
        </div>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <CasualtiesOverTime />
          <InfrastructureDamageChart />
        </div>
      </div>
    </AppLayout>
  );
}
