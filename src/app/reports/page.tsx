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
    <AppLayout pageTitle="Official Reports">
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg shadow-sm flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter by source:</span>
            </div>
          <Select onValueChange={setSourceFilter} defaultValue={sourceFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Source" />
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
