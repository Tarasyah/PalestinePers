import Link from 'next/link';
import type { OfficialReport } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, FileText } from 'lucide-react';

export function ReportCard({ report }: { report: OfficialReport }) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="p-2 rounded-md bg-secondary">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
          <CardDescription className="mt-1">
            {new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{report.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">{report.source}</Badge>
        <Button asChild variant="ghost" size="sm">
          <Link href={report.link}>
            Read Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
