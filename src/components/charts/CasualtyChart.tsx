// src/components/charts/CasualtyChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { useCombinedCasualties, type CombinedDailyData } from '@/hooks/useCombinedCasualties';
import { Skeleton } from '@/components/ui/skeleton';
import useSWR from 'swr';
import type { SummaryData } from '@/lib/data';
import CountUp from 'react-countup';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const fetcher = (url: string) => fetch(url).then(res => res.json());

// Komponen kecil untuk item statistik di atas
const StatItem = ({ value, label }: { value?: number, label: string }) => (
    <div className="text-center md:text-left">
      {value !== undefined ? (
        <span className="text-lg font-bold"><CountUp end={value} separator="," duration={1} /></span>
      ) : (
        <Skeleton className="h-6 w-20" />
      )}
      <span className={`ml-1 text-sm text-muted-foreground`}>{label}</span>
    </div>
);

export function CasualtyChart() {
  const { data: combinedData, isLoading, error } = useCombinedCasualties();
  const { data: summaryData, isLoading: summaryIsLoading } = useSWR<SummaryData>('https://data.techforpalestine.org/api/v3/summary.min.json', fetcher);

  const [dayIndex, setDayIndex] = useState(0);

  // Set slider ke hari terakhir saat data pertama kali dimuat
  useEffect(() => {
    if (combinedData && dayIndex === 0) {
      setDayIndex(combinedData.length - 1);
    }
  }, [combinedData, dayIndex]);

  if (isLoading) return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-card rounded-xl">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="w-full h-[500px]" />
      </div>
  );
  if (error) return <div className="text-destructive text-center p-10">Failed to load chart data.</div>;
  if (!combinedData) return null;

  const currentDataPoint = combinedData[dayIndex];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-card text-foreground rounded-xl shadow-lg border border-border/20">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">The Human Toll | Daily Casualties Datasets</h1>
        <p className="text-sm text-muted-foreground">Since October 7, 2023 for Gaza and the West Bank</p>
      </div>

       {/* DISCLAIMER */}
      <AlertDialog>
            <AlertDialogTrigger asChild>
                <Alert variant="destructive" className="my-4 bg-destructive/10 border-destructive/30 cursor-pointer hover:bg-destructive/20">
                    <AlertTriangle className="h-4 w-4 !text-destructive" />
                    <AlertTitle className="font-semibold !text-destructive">Disclaimer</AlertTitle>
                    <AlertDescription className="!text-destructive/80">
                        These numbers do not fully reflect the human toll. <span className="underline">Learn why</span>.
                    </AlertDescription>
                </Alert>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>About the Data</AlertDialogTitle>
                <AlertDialogDescription>
                    The casualty numbers presented here are based on the best available data from sources like the Palestinian Ministry of Health. However, the true human toll is likely much higher.
                    <br/><br/>
                    Factors include thousands of individuals missing under the rubble, undocumented deaths, and the difficulty of data collection in an active conflict zone. These numbers should be considered a conservative estimate.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction>Understand</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2 mb-6">
        <StatItem value={summaryData?.killed?.total} label="killed" />
        <StatItem value={summaryData?.injured?.total} label="injured" />
        <StatItem value={summaryData?.killed?.children} label="children killed" />
        <StatItem value={summaryData?.killed?.women} label="women killed" />
        <StatItem value={summaryData?.killed?.press} label="journalists killed" />
      </div>

      {/* CHART & BIG NUMBER */}
      <div className="relative w-full h-[350px]">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <p className="text-7xl font-bold text-foreground opacity-90">
                {currentDataPoint ? <CountUp end={currentDataPoint.total_cumulative_killed} separator="," duration={0.5} preserveValue /> : '0' }
            </p>
            <p className="text-2xl text-muted-foreground opacity-90">killed</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              formatter={(value: number, name: string, props) => [value.toLocaleString(), `Total Killed`]}
            />
            <Area type="monotone" dataKey="total_cumulative_killed" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#chartGradient)" />
            
            {/* EVENT MARKERS */}
            <ReferenceLine x="2024-01-26" stroke="hsl(var(--foreground))" strokeDasharray="3 3">
              <Label value="ICJ Ruling" position="insideTopLeft" fill="hsl(var(--muted-foreground))" fontSize={12} offset={10}/>
            </ReferenceLine>
             <ReferenceLine x="2024-05-24" stroke="hsl(var(--foreground))" strokeDasharray="3 3">
               <Label value="ICJ Orders Halt" position="insideTopLeft" fill="hsl(var(--muted-foreground))" fontSize={12} offset={10}/>
             </ReferenceLine>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* SLIDER */}
      <div className="mt-4">
        <Slider
          value={[dayIndex]}
          onValueChange={(value) => setDayIndex(value[0])}
          max={combinedData.length - 1}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Oct 7, 2023</span>
            {currentDataPoint && (
              <span className="font-bold text-foreground">
                {new Date(currentDataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} (Day {dayIndex + 1})
              </span>
            )}
            <span>Today</span>
        </div>
      </div>
    </div>
  );
}
