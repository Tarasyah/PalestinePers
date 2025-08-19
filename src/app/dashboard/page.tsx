"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { casualtyStats, casualtySource } from "@/lib/data";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  killed: {
    label: "Killed",
    color: "hsl(var(--destructive))",
  },
  injured: {
    label: "Injured",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Key Statistics Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Casualties</CardTitle>
              <CardDescription>
                A summary of reported casualties over the past six months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={casualtyStats}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="killed" fill="var(--color-killed)" radius={4} />
                  <Bar dataKey="injured" fill="var(--color-injured)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Source:{" "}
                <Link href={`https://${casualtySource}`} target="_blank" className="underline hover:text-primary">
                  {casualtySource}
                </Link>
              </p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Casualty Trends</CardTitle>
              <CardDescription>
                A line chart showing the trend of casualties over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart accessibilityLayer data={casualtyStats}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="killed"
                    type="monotone"
                    stroke="var(--color-killed)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <Line
                    dataKey="injured"
                    type="monotone"
                    stroke="var(--color-injured)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Source:{" "}
                <Link href={`https://${casualtySource}`} target="_blank" className="underline hover:text-primary">
                  {casualtySource}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
