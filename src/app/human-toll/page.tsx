import HumanTollChart from '@/components/charts/human-toll-chart';
import { AppLayout } from '@/components/app-layout';

export default function HumanTollPage() {
  return (
    <AppLayout>
      <div className="w-full">
        <HumanTollChart />
      </div>
    </AppLayout>
  );
}
