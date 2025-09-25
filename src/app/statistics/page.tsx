// src/app/statistics/page.tsx
"use client";

import { AppLayout } from "@/components/app-layout";
import GazaTracker from "@/components/gaza-tracker";

export default function StatisticsPage() {

  return (
    <AppLayout>
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 text-center">
                Live Statistics
            </h1>
            <div className="flex justify-center">
                <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-card">
                    <GazaTracker />
                </div>
            </div>
      </div>
    </AppLayout>
  );
}
