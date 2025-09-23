"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { InfrastructureDamage } from '@/lib/data';

const yAxisFormatter = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
};


export default function InfrastructureDamageChart() {
  const [chartData, setChartData] = useState<InfrastructureDamage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.min.json');
        if (!res.ok) {
          throw new Error('Failed to fetch infrastructure damage data');
        }
        const data: InfrastructureDamage[] = await res.json();
        
        const processedData = data
          .sort((a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime());

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
        <CardTitle>Damaged Infrastructure Over Time</CardTitle>
        <CardDescription>
          Cumulative number of damaged structures in Gaza since October 7th, 2023.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorResidential" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis 
              dataKey="report_date" 
              tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              minTickGap={30}
              tick={{ fontSize: 12 }}
              />
            <YAxis 
                tickFormatter={yAxisFormatter} 
                width={40}
                tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              formatter={(value: number, name: string) => [value.toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend />
            <Area type="monotone" dataKey="residential" name="Residential" stroke="#8884d8" fillOpacity={1} fill="url(#colorResidential)" />
            <Area type="monotone" dataKey="health" name="Health" stroke="#82ca9d" fillOpacity={1} fill="url(#colorHealth)" />
            <Area type="monotone" dataKey="education" name="Education" stroke="#ffc658" fill="transparent" />
            <Area type="monotone" dataKey="religious" name="Religious" stroke="#ff7300" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
