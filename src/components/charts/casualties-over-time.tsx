"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyCasualtyEntry } from '@/lib/data';
import { startOfWeek, isSameWeek } from 'date-fns';

interface ChartDataItem {
  date: string;
  GazaKilled: number;
  WestBankKilled: number;
  TotalKilled: number;
}

function mergeAndProcessData(gazaData: DailyCasualtyEntry[], westBankData: DailyCasualtyEntry[]): ChartDataItem[] {
  const combined: { [date: string]: { gazaKilled: number; westBankKilled: number } } = {};

  gazaData.forEach(entry => {
    const date = entry.report_date;
    if (!combined[date]) combined[date] = { gazaKilled: 0, westBankKilled: 0 };
    combined[date].gazaKilled = entry.killed_daily;
  });

  westBankData.forEach(entry => {
    const date = entry.report_date;
    if (!combined[date]) combined[date] = { gazaKilled: 0, westBankKilled: 0 };
    combined[date].westBankKilled = entry.killed_daily;
  });

  const dailyData = Object.keys(combined)
    .map(date => ({
      date: date,
      GazaKilled: combined[date].gazaKilled || 0,
      WestBankKilled: combined[date].westBankKilled || 0,
      TotalKilled: (combined[date].gazaKilled || 0) + (combined[date].westBankKilled || 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate to weekly data
  const weeklyData: ChartDataItem[] = [];
  if (dailyData.length === 0) return [];
  
  let currentWeekStart = startOfWeek(new Date(dailyData[0].date));
  let weeklyTotals: ChartDataItem = {
      date: currentWeekStart.toISOString().split('T')[0],
      GazaKilled: 0,
      WestBankKilled: 0,
      TotalKilled: 0
  };

  dailyData.forEach(day => {
      const dayDate = new Date(day.date);
      if (isSameWeek(dayDate, currentWeekStart)) {
          weeklyTotals.GazaKilled += day.GazaKilled;
          weeklyTotals.WestBankKilled += day.WestBankKilled;
          weeklyTotals.TotalKilled += day.TotalKilled;
      } else {
          weeklyData.push(weeklyTotals);
          currentWeekStart = startOfWeek(dayDate);
          weeklyTotals = {
              date: currentWeekStart.toISOString().split('T')[0],
              GazaKilled: day.GazaKilled,
              WestBankKilled: day.WestBankKilled,
              TotalKilled: day.TotalKilled,
          };
      }
  });
  weeklyData.push(weeklyTotals);

  return weeklyData;
}

const yAxisFormatter = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};


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
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis 
              dataKey="date" 
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
              labelFormatter={(label) => `Week of ${new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
            />
            <Legend />
            <Area 
                type="monotone" 
                dataKey="TotalKilled"
                name="Total Killed (Weekly)"
                stroke="hsl(var(--primary))"
                fillOpacity={1} 
                fill="url(#colorKilled)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
