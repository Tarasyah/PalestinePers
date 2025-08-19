"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { ReportCard } from "@/components/report-card";
import { supabase } from "@/lib/supabase";
import type { OfficialReport } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Filter, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";


const reportSources = [
  "All Sources",
  "UN",
  "Human Rights Watch",
  "Amnesty International",
  "WHO",
];

export default function ReportsPage() {
  const [sourceFilter, setSourceFilter] = React.useState("All Sources");
  const [reports, setReports] = React.useState<OfficialReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isScraping, setIsScraping] = React.useState(false);
  const { toast } = useToast();

  const fetchReports = React.useCallback(async (filter: string) => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('*')
      .eq('category', 'Official News') // Always filter for Official News category
      .order('published_at', { ascending: false });

    // Additionally filter by source if not "All Sources"
    if (filter !== "All Sources") {
      // Use a pattern match to catch variations like "HRW" for "Human Rights Watch"
      const searchPattern = `%${filter.replace(" ", "%")}%`;
      query = query.ilike('source', searchPattern);
    }

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch reports",
        description: error.message,
      });
      setReports([]);
      return;
    }

    const fetchedReports = data.map((report: any) => ({
        id: report.id,
        title: report.title,
        source: report.source,
        date: report.published_at,
        summary: report.summary,
        link: report.link,
      }));
      
    setReports(fetchedReports);
  }, [toast]);

  React.useEffect(() => {
    fetchReports(sourceFilter);
  }, [fetchReports, sourceFilter]);


  const handleRefreshAndScrape = async () => {
    setIsScraping(true);
    toast({
      title: "Scraping started...",
      description: "Fetching latest articles and reports. This may take a moment.",
    });

    try {
      const response = await fetch("https://pdmrygvnymhwgbvdrpki.supabase.co/functions/v1/scrape-news", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong during scraping.");
      }

      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${data.articlesScraped} articles.`,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: error.message,
      });
    } finally {
      // Refresh the data regardless of scrape outcome
      await fetchReports(sourceFilter);
      setIsScraping(false);
    }
  };
  
  const isRefreshing = isScraping || loading;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Official Reports</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 flex-grow">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <Select onValueChange={setSourceFilter} defaultValue={sourceFilter}>
                        <SelectTrigger className="w-full md:w-[220px]">
                        <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                        {reportSources.map((source) => (
                            <SelectItem key={source} value={source}>
                            {source}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button variant="outline" onClick={handleRefreshAndScrape} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isScraping ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>
        </div>
        
        {loading ? (
           <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                   <Skeleton className="h-12 w-12 rounded-md" />
                   <div className="flex-1 space-y-2">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-4 w-1/4" />
                     <Skeleton className="h-10 w-full mt-2" />
                   </div>
                </div>
              </Card>
            ))}
           </div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report: OfficialReport) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No reports found for the selected filter.</p>
            <p className="text-sm text-muted-foreground mt-2">Try refreshing the news or selecting "All Sources".</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
