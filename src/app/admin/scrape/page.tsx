"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ScrapePage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const { toast } = useToast();

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/scrape", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
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
      setLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Scrape News Feeds">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Manual Scraping Trigger</CardTitle>
            <CardDescription>
              Click the button below to start the web scraping process. This will
              fetch the latest articles from all configured news sources and
              store them in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleScrape} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                "Start Scraping"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Scraping Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Total Articles Scraped:</strong> {result.articlesScraped}
              </p>
              <h4 className="font-semibold">By Source:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {Object.entries(result.sources).map(([source, count]) => (
                  <li key={source}>
                    {source}: {count as number}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
