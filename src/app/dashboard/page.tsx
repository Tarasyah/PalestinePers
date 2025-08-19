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
        <Card className="w-full max-w-md bg-black text-white rounded-lg shadow-2xl p-8">
          <CardHeader className="text-center p-0 mb-8">
            <CardTitle className="text-5xl font-bold tracking-tight text-white">
              Gaza genocide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-bold">{stats.days}</span>
              <span className="text-2xl font-light tracking-wider">DAYS</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-bold">{stats.killed}</span>
              <span className="text-2xl font-light tracking-wider">KILLED</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="text-4xl font-bold">{stats.wounded}</span>
              <span className="text-2xl font-light tracking-wider">WOUNDED</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="text-4xl font-bold">{stats.missing}</span>
              <span className="text-2xl font-light tracking-wider">MISSING</span>
            </div>
             <div className="text-center text-neutral-400 pt-6">
                <p>Last updated: {stats.lastUpdated}</p>
                <p className="text-sm">
                    Source:{" "}
                    <a
                        href={stats.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-neutral-200"
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
