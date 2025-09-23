
"use client";

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SummaryData } from '@/lib/data';

function StatCard({ title, value, isLoading }: { title: string; value: number | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value !== undefined ? (
            <CountUp
              end={value}
              duration={2.5}
              separator=","
            />
          ) : 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CasualtySummary() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('https://data.techforpalestine.org/api/v3/summary.min.json');
        if (!res.ok) {
          throw new Error('Failed to fetch summary data');
        }
        const data: SummaryData = await res.json();
        setSummaryData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setSummaryData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error loading summary: {error}</div>;
  }

  const stats = [
    { title: "Total Killed", getValue: (data: SummaryData) => data?.killed?.total },
    { title: "Total Injured", getValue: (data: SummaryData) => data?.injured?.total },
    { title: "Children Killed", getValue: (data: SummaryData) => data?.killed?.children },
    { title: "Women Killed", getValue: (data: SummaryData) => data?.killed?.women },
    { title: "Journalists Killed", getValue: (data: SummaryData) => data?.killed?.press },
    { title: "Civil Defence Killed", getValue: (data: SummaryData) => data?.killed?.civil_defence },
    { title: "Health Workers Killed", getValue: (data: SummaryData) => data?.killed?.health_workers },
    { title: "UN Staff Killed", getValue: (data: SummaryData) => data?.killed?.un_staff },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Casualty Summary</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={loading || !summaryData ? undefined : stat.getValue(summaryData)} 
            isLoading={loading} 
          />
        ))}
      </div>
        { !loading && summaryData?.last_update && (
             <p className="text-xs text-muted-foreground mt-2 text-center">
                Last updated: {new Date(summaryData.last_update).toLocaleString()}
            </p>
        )}
    </div>
  );
}

