"use client";

import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import CountUp from 'react-countup';
import { format, differenceInDays, addDays } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyCasualtyEntry, SummaryData } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ChartDataItem {
  date: string;
  dayNumber: number;
  gazaKilled: number;
  westBankKilled: number;
  totalKilled: number;
  cumulativeKilled: number;
}

const START_DATE = new Date('2023-10-07');

// Data for notable events
const events = [
  { date: '2024-01-26', label: 'ICJ Ruling', y: 30000 },
  { date: '2024-05-24', label: 'ICJ Orders Halt', y: 45000 },
  { date: '2024-07-01', label: 'GHF Start', y: 55000 },
];

function processData(gazaData: DailyCasualtyEntry[], westBankData: DailyCasualtyEntry[]): ChartDataItem[] {
  const combined: { [date: string]: { gaza: number; westBank: number } } = {};

  gazaData.forEach(entry => {
    if (!combined[entry.report_date]) combined[entry.report_date] = { gaza: 0, westBank: 0 };
    combined[entry.report_date].gaza = entry.killed_daily || 0;
  });

  westBankData.forEach(entry => {
    if (!combined[entry.report_date]) combined[entry.report_date] = { gaza: 0, westBank: 0 };
    combined[entry.report_date].westBank = entry.killed_daily || 0;
  });

  const sortedDates = Object.keys(combined).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  let cumulativeKilled = 0;
  return sortedDates.map(date => {
    const dayData = combined[date];
    const totalKilled = dayData.gaza + dayData.westBank;
    cumulativeKilled += totalKilled;
    const dayNumber = differenceInDays(new Date(date), START_DATE) + 1;
    return {
      date,
      dayNumber,
      gazaKilled: dayData.gaza,
      westBankKilled: dayData.westBank,
      totalKilled,
      cumulativeKilled,
    };
  });
}


const CustomDot = (props: any) => {
    const { cx, cy, payload, eventLabel } = props;
  
    // Don't render a dot if it's not an event
    if (!eventLabel) return null;
  
    return (
      <>
        <Dot cx={cx} cy={cy} r={6} stroke="white" strokeWidth={2} fill="hsl(var(--primary))" />
        <line x1={cx} y1={cy} x2={cx} y2={cy + 30} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
        <text x={cx} y={cy + 45} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">
          {eventLabel}
        </text>
      </>
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
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [gazaRes, westBankRes, summaryRes] = await Promise.all([
          fetch('https://data.techforpalestine.org/api/v2/casualties_daily.min.json'),
          fetch('https://data.techforpalestine.org/api/v2/west_bank_daily.min.json'),
          fetch('https://data.techforpalestine.org/api/v3/summary.min.json'),
        ]);

        if (!gazaRes.ok || !westBankRes.ok || !summaryRes.ok) {
          throw new Error('Failed to fetch all required data');
        }

        const gazaData: DailyCasualtyEntry[] = await gazaRes.json();
        const westBankData: DailyCasualtyEntry[] = await westBankRes.json();
        const summary: SummaryData = await summaryRes.json();
        
        const processed = processData(gazaData, westBankData);
        setData(processed);
        setSummaryData(summary);
        setSliderValue(processed.length); // Set slider to the latest day
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeData = useMemo(() => {
    if (data.length === 0) return null;
    // Slider value is 1-based day number, index is 0-based
    const index = Math.min(Math.max(sliderValue - 1, 0), data.length - 1);
    return data[index];
  }, [sliderValue, data]);
  
  const eventDots = useMemo(() => {
    return events.map(event => {
      const eventDayNumber = differenceInDays(new Date(event.date), START_DATE) + 1;
      const dataPoint = data.find(d => d.dayNumber === eventDayNumber);
      if (!dataPoint) return null;
      return { ...dataPoint, eventLabel: event.label };
    }).filter(Boolean);
  }, [data]);


  if (loading) {
    return <Skeleton className="w-full h-[700px]" />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">Error loading data: {error}</div>;
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1 text-sm mb-6">
            <StatItem value={summaryData?.killed?.total} label="killed" subLabel="seeking aid" />
            <StatItem value={summaryData?.injured?.total} label="injured" subLabel="" />
            <StatItem value={summaryData?.killed?.children} label="children" subLabel="killed" />
            <StatItem value={0} label="starved" subLabel="to death" />
            <StatItem value={summaryData?.killed?.women} label="women" subLabel="killed" />
            <StatItem value={summaryData?.killed?.health_workers} label="medical personnel" subLabel="killed" />
            <StatItem value={summaryData?.killed?.press} label="journalists" subLabel="killed" />
            <StatItem value={summaryData?.killed?.civil_defence} label="first responders" subLabel="killed" />
            <StatItem value={0} label="settler" subLabel="attacks" />
        </div>

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
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                    formatter={(value: number, name: string, props) => {
                        const date = format(new Date(props.payload.date), 'MMM d, yyyy');
                        return [value.toLocaleString(), `Killed on ${date}`];
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

                {/* Event Markers */}
                {eventDots.map((event, index) => event && (
                    <ReferenceLine key={index} x={event.dayNumber} stroke="transparent" >
                        <CustomDot cx={0} cy={0} payload={event} eventLabel={event.eventLabel} />
                    </ReferenceLine>
                ))}
            </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-4 px-4">
            <Slider
                min={1}
                max={data.length}
                step={1}
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
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

    