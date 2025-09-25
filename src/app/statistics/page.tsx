// src/app/statistics/page.tsx
"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const casualtiesUrl = "https://app.powerbi.com/view?r=eyJrIjoiODAxNTYzMDYtMjQ3YS00OTMzLTkxMWQtOTU1NWEwMzE5NTMwIiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9";
const demolitionsUrl = "https://app.powerbi.com/view?r=eyJrIjoiMmJkZGRhYWQtODk0MS00MWJkLWI2NTktMDg1NGJlMGNiY2Y3IiwidCI6IjBmOWUzNWRiLTU0NGYtNGY2MC1iZGNjLTVlYTQxNmU2ZGM3MCIsImMiOjh9";

export default function StatisticsPage() {

  const renderDashboard = (title: string, src: string) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-lg overflow-hidden border">
          <iframe
            title={title}
            width="100%"
            height="100%"
            src={src}
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 text-center">
          Occupied Palestinian Territory Data
        </h1>
        <div className="grid gap-8 lg:grid-cols-1">
          {renderDashboard("Casualties", casualtiesUrl)}
          {renderDashboard("West Bank Demolitions & Displacement", demolitionsUrl)}
        </div>
      </div>
    </AppLayout>
  );
}
