"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { ReportCard } from "@/components/report-card";
import { officialReports } from "@/lib/data";
import type { OfficialReport } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

const sources = ["All Sources", ...Array.from(new Set(officialReports.map((r) => r.source)))];

export default function ReportsPage() {
  const [sourceFilter, setSourceFilter] = React.useState("All Sources");

  const filteredReports = officialReports.filter((report) =>
    sourceFilter === "All Sources" ? true : report.source === sourceFilter
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Official Reports</h2>
            <div className="flex items-center gap-2">
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
        </div>
        
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report: OfficialReport) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No reports found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
