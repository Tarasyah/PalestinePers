"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = {
  days: 681,
  killed: "62,004",
  wounded: "156,230",
  missing: "11,000",
  lastUpdated: "August 18, 2025",
  source: "Euro-Med Human Rights Monitor",
  sourceLink: "https://euromedmonitor.org/en/",
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex justify-center items-start pt-10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl font-bold tracking-tight">
              Gaza Genocide Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-8 py-6">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold">{stats.days}</span>
              <span className="text-xl font-light tracking-wider text-muted-foreground">DAYS</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-destructive">{stats.killed}</span>
              <span className="text-xl font-light tracking-wider text-muted-foreground">KILLED</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold">{stats.wounded}</span>
              <span className="text-xl font-light tracking-wider text-muted-foreground">WOUNDED</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold">{stats.missing}</span>
              <span className="text-xl font-light tracking-wider text-muted-foreground">MISSING</span>
            </div>
             <div className="text-center text-muted-foreground pt-4 border-t mt-4">
                <p>Last updated: {stats.lastUpdated}</p>
                <p className="text-sm">
                    Source:{" "}
                    <a
                        href={stats.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                    >
                        {stats.source}
                    </a>
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
