"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

function GazaTracker() {
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const startDate = new Date('2023-10-07T00:00:00Z');
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
    setDays(daysDiff);
  }, []);

  useEffect(() => {
    async function fetchTrackerData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('gaza_tracker')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        setTracker(null);
      } else {
        setTracker(data);
      }
      setLoading(false);
    }

    fetchTrackerData();
  }, []);

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
    <div className="gaza-tracker-stats space-y-4">
      <div>
        <h4 className="font-bold text-lg text-white">Gaza Casualty Tracker</h4>
      </div>
      
      <ul className="space-y-1 list-none text-white text-sm">
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
