"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

function GazaTracker() {
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching tracker data:', error);
        setTracker(null);
      } else {
        setTracker(data);
      }
      setLoading(false);
    }

    fetchTrackerData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
          <Skeleton className="h-5 w-5/6" />
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
      
      <ul className="space-y-1 list-disc list-inside text-white text-sm">
        <li><strong>Confirmed killed:</strong> {tracker.confirmed_killed?.toLocaleString()} (incl. {tracker.children_killed?.toLocaleString()} children)</li>
        <li><strong>Injured:</strong> {tracker.injured?.toLocaleString()}</li>
        <li><strong>Starvation Deaths:</strong> {tracker.starvation_deaths} (incl. {tracker.children_starvation_deaths} children)</li>
      </ul>

      {tracker.deaths_chart_url && (
        <div className="relative w-full aspect-video">
           <Image src={tracker.deaths_chart_url} alt="Gaza death tracker chart" layout="fill" objectFit="contain" className="rounded-lg border border-white/10" />
        </div>
      )}
      {tracker.famine_chart_url && (
        <div className="relative w-full aspect-video">
          <Image src={tracker.famine_chart_url} alt="Gaza famine tracker chart" layout="fill" objectFit="contain" className="rounded-lg border border-white/10" />
        </div>
       )}
       <p><small className="text-muted-foreground text-xs">Source: Palestinian Ministry of Health in Gaza as of {new Date(tracker.update_date).toLocaleDateString()}</small></p>
    </div>
  );
}

export default GazaTracker;
