// src/app/statistics/page.tsx
"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const demolitionsUrl = "https://app.powerbi.com/view?r=eyJrIjoiNzI3N2QwMTMtNjEwZC00YjFhLWEzMzEtOWFkZmY2YjE5YjU5IiwidCI6IjI2MmY2MjExLTI5MGItNDhiNy04MWI4LWMzYjZiZDUwNTE1MyIsImMiOjl9";
const casualtiesUrl = "https://app.powerbi.com/view?r=eyJrIjoiYmJhM2YxMTEtZTIyMy00YjRkLWE2YjktZGY5YjMyOTgwYjU5IiwidCI6IjI2MmY2MjExLTI5MGItNDhiNy04MWI4LWMzYjZiZDUwNTE1MyIsImMiOjl9";

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
        <p className="text-xs text-muted-foreground mt-2">
            Source: <a href="https://www.ochaopt.org/" target="_blank" rel="noopener noreferrer" className="underline">UN OCHA-OPT</a> via Power BI
        </p>
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
          {renderDashboard("West Bank Demolitions & Displacement", demolitionsUrl)}
          {renderDashboard("Casualties", casualtiesUrl)}
        </div>
      </div>
    </AppLayout>
  );
}
