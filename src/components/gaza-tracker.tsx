
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface GazaTrackerProps {
  refreshTrigger?: number;
}

function GazaTracker({ refreshTrigger }: GazaTrackerProps) {
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number | null>(null);

  const calculateDaysInWIB = useCallback(() => {
    // WIB is UTC+7
    const WIB_OFFSET = 7 * 60 * 60 * 1000;
    
    // Get current time in UTC, then adjust to WIB
    const nowUtc = new Date();
    const nowWib = new Date(nowUtc.getTime() + WIB_OFFSET);

    // Start date in UTC
    const startDate = new Date('2023-10-07T00:00:00Z');

    // To properly calculate the difference in days, we should work with dates only, ignoring time.
    // We create a WIB version of the start date to be safe, although for 00:00:00Z it's the same calendar day in WIB.
    const startDateInWIB = new Date(startDate.getTime() + WIB_OFFSET);
    
    // Get the start of the day for both dates in WIB
    const startOfTodayWIB = new Date(nowWib.getFullYear(), nowWib.getMonth(), nowWib.getDate());
    const startOfStartDateWIB = new Date(startDateInWIB.getFullYear(), startDateInWIB.getMonth(), startDateInWIB.getDate());

    const timeDiff = startOfTodayWIB.getTime() - startOfStartDateWIB.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    setDays(daysDiff);
    return nowWib;
  }, []);

  useEffect(() => {
    const nowWib = calculateDaysInWIB();

    // Calculate time until next midnight in WIB
    const tomorrowWib = new Date(nowWib.getFullYear(), nowWib.getMonth(), nowWib.getDate() + 1);
    const msUntilMidnightWIB = tomorrowWib.getTime() - nowWib.getTime();

    const timeout = setTimeout(() => {
      calculateDaysInWIB(); // Recalculate right at midnight
      // Then set up the daily interval
      const dailyInterval = setInterval(calculateDaysInWIB, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnightWIB);

    return () => clearTimeout(timeout);
  }, [calculateDaysInWIB]);

  const fetchTrackerData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gaza_tracker')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching Gaza tracker data:", error.message);
      setTracker(null);
    } else {
      setTracker(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrackerData();
  }, [fetchTrackerData, refreshTrigger]);

  const renderImage = (src: string, alt: string) => {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-auto cursor-pointer hover:opacity-80 transition-opacity">
          <Image 
            src={src} 
            alt={alt} 
            width={500} 
            height={800} 
            objectFit="contain" 
            className="rounded-lg border border-white/10" 
          />
        </div>
      </a>
    );
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
        </div>
        <Skeleton className="w-full aspect-video rounded-lg" />
        <Skeleton className="w-full aspect-video rounded-lg" />
        <Skeleton className="h-4 w-full mt-2" />
      </div>
    );
  }
  
  if (!tracker) {
    return <div className="text-center text-muted-foreground">Could not load Gaza Tracker stats. Please check RLS policies on the 'gaza_tracker' table.</div>;
  }

  return (
    <div className="gaza-tracker-stats space-y-4 flex flex-col items-center">
      <div className="w-full">
        <h4 className="font-bold text-lg text-white text-center">Gaza Casualty Tracker</h4>
      </div>
      
      <ul className="space-y-1 list-none text-white text-sm w-full">
        {days !== null && <li><strong>Days:</strong> {days}</li>}
        <li><strong>Killed:</strong> {tracker.confirmed_killed?.toLocaleString()} (incl. {tracker.children_killed?.toLocaleString()} children)</li>
        <li><strong>Injured:</strong> {tracker.injured?.toLocaleString()}</li>
        <li><strong>Starvation Deaths:</strong> {tracker.starvation_deaths} (incl. {tracker.children_starvation_deaths} children)</li>
      </ul>

      {tracker.deaths_chart_url && renderImage(tracker.deaths_chart_url, "Gaza death tracker chart")}
      {tracker.famine_chart_url && renderImage(tracker.famine_chart_url, "Gaza famine tracker chart")}
       
       <p className="text-center"><small className="text-muted-foreground text-xs">Source: Palestinian Ministry of Health in Gaza</small></p>
    </div>
  );
}

export default GazaTracker;
