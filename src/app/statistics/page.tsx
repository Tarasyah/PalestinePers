import { AppLayout } from "@/components/app-layout";

export default function StatisticsPage() {
  const healthDashboardUrl = "https://app.powerbi.com/view?r=eyJrIjoiODAxNTYzMDYtMjQ3YS00OTMzLTkxMWQtOTU1NWEwMzE5NTMwIiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";
  const demolitionDashboardUrl = "https://app.powerbi.com/view?r=eyJrIjoiZjZiMzYyZjItOWUxNi00OTgyLWE3Y2MtMWE5ZDlmNGE1NjM3IiwidCI6IjBmOWUzNWRiLTU0NGYtNGY2MC1iZGNjLTVlYTQxNmU2ZGM3MCIsImMiOjh9";

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">oPt Unified Health Dashboard</h2>
          <div className="w-full h-[90vh]">
            <iframe
              title="oPt Unified Health Dashboard"
              width="100%"
              height="100%"
              src={healthDashboardUrl}
              frameBorder="0"
              allowFullScreen={true}
              className="rounded-lg border"
            ></iframe>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Data on demolition and displacement in the West Bank</h2>
          <div className="w-full h-[90vh]">
            <iframe
              title="Data on demolition and displacement in the West Bank"
              width="100%"
              height="100%"
              src={demolitionDashboardUrl}
              frameBorder="0"
              allowFullScreen={true}
              className="rounded-lg border"
            ></iframe>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
