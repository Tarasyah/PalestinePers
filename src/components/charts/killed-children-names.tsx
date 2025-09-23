"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChildNameCount } from '@/lib/data';

export default function KilledChildrenNames() {
  const [chartData, setChartData] = useState<ChildNameCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('https://data.techforpalestine.org/api/v2/killed-in-gaza/child-name-counts-en.json');
        if (!res.ok) {
          throw new Error('Failed to fetch child name counts');
        }
        const data: { [key: string]: number } = await res.json();
        
        const processedData = Object.entries(data)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15); // Get top 15 names

        setChartData(processedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error loading chart: {error}</div>;
  }

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full h-96" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Common Names of Killed Children</CardTitle>
        <CardDescription>
          Top 15 most frequent names of children killed in Gaza since October 7th, 2023.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
              }}
              formatter={(value: number) => [value.toLocaleString(), "Count"]}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="count" position="right" style={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
