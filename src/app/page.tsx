import { AppLayout } from "@/components/app-layout";
import { CasualtyChart } from "@/components/charts/CasualtyChart";
import CasualtySummary from "@/components/charts/casualty-summary";
import InfrastructureDamageChart from "@/components/charts/infrastructure-damage-chart";
import KilledChildrenNames from "@/components/charts/killed-children-names";
import VictimsTable from "@/components/charts/press-killed-table";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <CasualtyChart />
        <CasualtySummary />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfrastructureDamageChart />
          <KilledChildrenNames />
        </div>
        <VictimsTable />
      </div>
    </AppLayout>
  );
}
