
"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyCasualtyEntry } from '@/lib/data';

interface ChartDataItem {
  date: string;
  GazaKilled: number;
  GazaInjured: number;
  WestBankKilled: number;
  WestBankInjured: number;
  TotalKilled: number;
}

function mergeAndProcessData(gazaData: DailyCasualtyEntry[], westBankData: DailyCasualtyEntry[]): ChartDataItem[] {
  const combined: { [date: string]: Partial<ChartDataItem> } = {};

  gazaData.forEach(entry => {
    const date = entry.report_date;
    if (!combined[date]) combined[date] = { date };
    combined[date].GazaKilled = entry.killed_total;
    combined[date].GazaInjured = entry.injured_total;
  });

  westBankData.forEach(entry => {
    const date = entry.report_date;
    if (!combined[date]) combined[date] = { date };
    combined[date].WestBankKilled = entry.killed_total;
    combined[date].WestBankInjured = entry.injured_total;
  });

  const chartData = Object.values(combined)
    .map(d => ({
      date: d.date!,
      GazaKilled: d.GazaKilled || 0,
      GazaInjured: d.GazaInjured || 0,
      WestBankKilled: d.WestBankKilled || 0,
      WestBankInjured: d.WestBankInjured || 0,
      TotalKilled: (d.GazaKilled || 0) + (d.WestBankKilled || 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Aggregate to weekly data to make chart more readable
    const weeklyData: ChartDataItem[] = [];
    if (chartData.length > 0) {
        let weekStart = new Date(chartData[0].date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        let weeklyTotals: ChartDataItem = {
            date: weekStart.toISOString().split('T')[0],
            GazaKilled: 0,
            GazaInjured: 0,
            WestBankKilled: 0,
            WestBankInjured: 0,
            TotalKilled: 0
        };

        chartData.forEach(daily => {
            const currentDate = new Date(daily.date);
            if (currentDate.getTime() < weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) {
                weeklyTotals.GazaKilled += daily.GazaKilled;
                weeklyTotals.GazaInjured += daily.GazaInjured;
                weeklyTotals.WestBankKilled += daily.WestBankKilled;
                weeklyTotals.WestBankInjured += daily.WestBankInjured;
                weeklyTotals.TotalKilled += daily.TotalKilled;
            } else {
                weeklyData.push(weeklyTotals);
                weekStart.setDate(weekStart.getDate() + 7);
                weeklyTotals = {
                    date: weekStart.toISOString().split('T')[0],
                    GazaKilled: daily.GazaKilled,
                    GazaInjured: daily.GazaInjured,
                    WestBankKilled: daily.WestBankKilled,
                    WestBankInjured: daily.TotalKilled,
                    TotalKilled: daily.TotalKilled,
                };
            }
        });
        weeklyData.push(weeklyTotals);
    }
    return weeklyData;
}


export default function CasualtiesOverTime() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [gazaRes, westBankRes] = await Promise.all([
          fetch('https://data.techforpalestine.org/api/v2/casualties_daily.min.json'),
          fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.min.json'),
        ]);

        if (!gazaRes.ok || !westBankRes.ok) {
          throw new Error('Failed to fetch time-series data');
        }

        const gazaData: DailyCasualtyEntry[] = await gazaRes.json();
        const westBankData: DailyCasualtyEntry[] = await westBankRes.json();
        
        const processedData = mergeAndProcessData(gazaData, westBankData);
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
        <CardTitle>Casualties Over Time (Weekly Aggregation)</CardTitle>
        <CardDescription>
          Total number of killed Palestinians in Gaza and the West Bank since October 7th, 2023.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              minTickGap={30}
              />
            <YAxis 
                tickFormatter={(value) => value.toLocaleString()} 
                width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
            />
            <Legend />
            <Area 
                type="monotone" 
                dataKey="TotalKilled"
                name="Total Killed (Weekly)"
                stroke="#ef4444"
                fillOpacity={1} 
                fill="url(#colorKilled)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
