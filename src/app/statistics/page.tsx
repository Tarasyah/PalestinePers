import { AppLayout } from "@/components/app-layout";

export default function StatisticsPage() {
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiODAxNTYzMDYtMjQ3YS00OTMzLTkxMWQtOTU1NWEwMzE5NTMwIiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";

  return (
    <AppLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">oPt Unified Health Dashboard</h2>
        <div className="w-full h-[90vh]">
          <iframe
            title="oPt Unified Health Dashboard"
            width="100%"
            height="100%"
            src={powerBiUrl}
            frameBorder="0"
            allowFullScreen={true}
            className="rounded-lg border"
          ></iframe>
        </div>
      </div>
    </AppLayout>
  );
}
