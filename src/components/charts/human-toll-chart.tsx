
"use client";

import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import CountUp from 'react-countup';
import { format, differenceInDays } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import type { SummaryData } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';

interface DailyCasualtyEntry {
  report_date: string;
  killed_total: number;
  injured_total: number;
  killed_daily: number;
  injured_daily: number;
}

interface ChartDataItem {
  date: string;
  dayNumber: number;
  cumulativeKilled: number;
}

const START_DATE = new Date('2023-10-07');

const events = [
  { date: '2024-01-26', label: 'ICJ Ruling' },
  { date: '2024-05-24', label: 'ICJ Orders Halt' },
  { date: '2024-07-01', label: 'GHF Start' },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CustomDot = (props: any) => {
    const { cx, cy, payload, eventLabel } = props;
  
    if (!eventLabel) return null;
  
    // Position dot based on chart data, not hardcoded coordinates
    const chartHeight = 350; // Approximate height of the chart content area
    const yPosition = cy > chartHeight / 2 ? cy - 30 : cy + 50;
    const lineEndY = cy > chartHeight / 2 ? cy - 20 : cy + 40;
    const textY = cy > chartHeight / 2 ? cy - 40 : cy + 60;

    return (
      <g>
        <circle cx={cx} cy={cy} r={5} stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--background))" />
        <line x1={cx} y1={cy} x2={cx} y2={lineEndY} stroke="hsl(var(--foreground))" strokeDasharray="2 2" />
        <text x={cx} y={textY} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
          {eventLabel}
        </text>
      </g>
    );
};

const StatItem = ({ value, label, subLabel }: { value?: number, label: string, subLabel: string }) => (
    <div className="text-center md:text-left">
      <span className="text-lg font-bold">
        {value !== undefined ? <CountUp end={value} separator="," duration={1.5} /> : 'N/A'}
      </span>
      <span className="text-destructive ml-1">{label}</span>
      <span className="text-muted-foreground ml-1">{subLabel}</span>
    </div>
);


export default function HumanTollChart() {
  const { data: gazaData, error: gazaError, isLoading: gazaLoading } = useSWR<DailyCasualtyEntry[]>('https://data.techforpalestine.org/api/v2/casualties_daily.min.json', fetcher);
  const { data: westBankData, error: westBankError, isLoading: westBankLoading } = useSWR<DailyCasualtyEntry[]>('https://data.techforpalestine.org/api/v2/west_bank_daily.min.json', fetcher);
  const { data: summaryData, error: summaryError, isLoading: summaryLoading } = useSWR<SummaryData>('https://data.techforpalestine.org/api/v3/summary.min.json', fetcher);
  
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  const chartData = useMemo<ChartDataItem[] | null>(() => {
    if (!gazaData || !westBankData) return null;

    const combined: { [date: string]: number } = {};

    gazaData.forEach(entry => {
        combined[entry.report_date] = (combined[entry.report_date] || 0) + (entry.killed_daily || 0);
    });
    westBankData.forEach(entry => {
        combined[entry.report_date] = (combined[entry.report_date] || 0) + (entry.killed_daily || 0);
    });

    const sortedDates = Object.keys(combined).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let cumulativeKilled = 0;
    return sortedDates.map((date, index) => {
      cumulativeKilled += combined[date];
      return {
        date,
        dayNumber: index + 1,
        cumulativeKilled,
      };
    });
  }, [gazaData, westBankData]);

  useEffect(() => {
    if (chartData && chartData.length > 0 && sliderValue[0] === 0) {
      setSliderValue([chartData.length]);
    }
  }, [chartData, sliderValue]);

  const activeData = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    const index = Math.min(Math.max(sliderValue[0] - 1, 0), chartData.length - 1);
    return chartData[index];
  }, [sliderValue, chartData]);
  
  const eventDots = useMemo(() => {
    if (!chartData) return [];
    return events.map(event => {
      const dataPoint = chartData.find(d => d.date === event.date);
      if (!dataPoint) return null;
      return { ...dataPoint, eventLabel: event.label };
    }).filter(Boolean as unknown as (value: any) => value is { date: string; dayNumber: number; cumulativeKilled: number; eventLabel: string; });
  }, [chartData]);
  
  const isLoading = gazaLoading || westBankLoading || summaryLoading;
  const error = gazaError || westBankError || summaryError;

  if (isLoading) {
    return <Skeleton className="w-full h-[700px]" />;
  }

  if (error || !chartData) {
    return <div className="text-center text-red-500 p-8">Error loading data: {error?.message || 'Could not process chart data.'}</div>;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-none shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl md:text-3xl font-bold">The Human Toll | Daily Casualties Datasets</CardTitle>
        <p className="text-muted-foreground">Since October 7, 2023 for Gaza and the West Bank</p>
         <Alert variant="destructive" className="max-w-lg mt-2 bg-destructive/10 border-destructive/30">
            <AlertTriangle className="h-4 w-4 !text-destructive" />
            <AlertTitle className="font-semibold !text-destructive">Disclaimer</AlertTitle>
            <AlertDescription className="!text-destructive/80">
                These numbers do not fully reflect the human toll. <a href="#" className="underline">Learn why</a>.
            </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {summaryLoading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1 text-sm mb-6">
             {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1 text-sm mb-6">
              <StatItem value={summaryData?.killed?.total} label="killed" subLabel="in total" />
              <StatItem value={summaryData?.injured?.total} label="injured" subLabel="" />
              <StatItem value={summaryData?.killed?.children} label="children" subLabel="killed" />
              <StatItem value={summaryData?.killed?.women} label="women" subLabel="killed" />
              <StatItem value={summaryData?.killed?.health_workers} label="medical personnel" subLabel="killed" />
              <StatItem value={summaryData?.killed?.press} label="journalists" subLabel="killed" />
              <StatItem value={summaryData?.killed?.civil_defence} label="first responders" subLabel="killed" />
              <StatItem value={summaryData?.killed?.un_staff} label="UN staff" subLabel="killed" />
          </div>
        )}

        <div className="relative w-full h-[400px]">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center">
                    <div className="text-7xl md:text-8xl font-bold text-foreground/90 tracking-tighter">
                       {activeData && <CountUp end={activeData.cumulativeKilled} separator="," duration={0.5} preserveValue />}
                    </div>
                    <p className="text-2xl text-muted-foreground">killed</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <defs>
                <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <XAxis 
                    dataKey="dayNumber"
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    domain={['dataMin', 'dataMax']}
                    type="number"
                />
                <Tooltip
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    labelFormatter={(label) => `Day ${label}`}
                    formatter={(value: number, name: string, props: any) => {
                        const date = format(new Date(props.payload.date), 'MMM d, yyyy');
                        return [value.toLocaleString(), `Total Killed by ${date}`];
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="cumulativeKilled" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#colorKilled)" 
                    dot={false}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: 'hsl(var(--primary))' }}
                />
                {eventDots.map((event, index) => (
                    <ReferenceLine key={index} x={event.dayNumber} stroke="transparent" ifOverflow="extendDomain">
                       {/* @ts-ignore */}
                      <CustomDot eventLabel={event.eventLabel} />
                    </ReferenceLine>
                ))}
            </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-4 px-4">
            <Slider
                min={1}
                max={chartData.length}
                step={1}
                value={sliderValue}
                onValueChange={setSliderValue}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Oct 7, 2023</span>
                 <div className="font-bold text-sm text-foreground">
                    {activeData ? `${format(new Date(activeData.date), 'MMMM do')} (Day ${activeData.dayNumber})` : 'Loading...'}
                </div>
                <span>Today</span>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-1">Use the slider to change the date</p>
        </div>
      </CardContent>
    </Card>
  );
}
