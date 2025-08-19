"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { ReportCard } from "@/components/report-card";
import { getNewsArticles, officialReports } from "@/lib/data";
import type { OfficialReport, NewsArticleWithReports } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Filter, RefreshCw } from "lucide-react";

const sources = ["All Sources", ...Array.from(new Set(officialReports.map((r) => r.source)))];

export default function ReportsPage() {
  const [sourceFilter, setSourceFilter] = React.useState("All Sources");
  const [reports, setReports] = React.useState<OfficialReport[]>(officialReports);
  const [isScraping, setIsScraping] = React.useState(false);
  const { toast } = useToast();

  const fetchReports = React.useCallback(async () => {
    // In a real scenario, you might want to fetch this from a DB.
    // For now, we are just re-setting it from the static data.
    const fetchedArticles = await getNewsArticles();
    const officialReportsFromArticles = fetchedArticles
      .filter(a => a.category === 'Official News')
      .map(a => ({
        id: a.id,
        title: a.title,
        source: a.source as 'UN' | 'Human Rights Watch' | 'Amnesty International' | 'WHO',
        date: a.date,
        summary: a.excerpt,
        link: a.link,
      }));
    
    // To ensure we have all reports, we can merge and remove duplicates
    const allReports = [...officialReports, ...officialReportsFromArticles];
    const uniqueReports = allReports.filter((report, index, self) =>
      index === self.findIndex((r) => (
        r.id === report.id
      ))
    );

    setReports(uniqueReports);
  }, []);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);


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
      await fetchReports();
      setIsScraping(false);
    }
  };

  const filteredReports = reports.filter((report) =>
    sourceFilter === "All Sources" ? true : report.source === sourceFilter
  );
  
  const isRefreshing = isScraping;

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
                        {sources.map((source) => (
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
        
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report: OfficialReport) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No reports found for the selected filter.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
