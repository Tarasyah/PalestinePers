
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PressKilled } from '@/lib/data';

export default function PressKilledTable() {
  const [journalists, setJournalists] = useState<PressKilled[]>([]);
  const [filteredJournalists, setFilteredJournalists] = useState<PressKilled[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('https://data.techforpalestine.org/api/v2/press_killed_in_gaza.min.json');
        if (!res.ok) {
          throw new Error('Failed to fetch press killed data');
        }
        const data: PressKilled[] = await res.json();
        const sortedData = data.sort((a,b) => new Date(b.date_of_death).getTime() - new Date(a.date_of_death).getTime())
        setJournalists(sortedData);
        setFilteredJournalists(sortedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const results = journalists.filter(j =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJournalists(results);
  }, [searchTerm, journalists]);

  if (error) {
    return <div className="text-center text-red-500">Error loading data: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journalists & Media Workers Killed in Gaza</CardTitle>
        <CardDescription>
          A list of journalists and media workers killed since October 7th, 2023.
        </CardDescription>
         <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Death</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJournalists.map((j, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                        <a href={j.source_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {j.name}
                        </a>
                    </TableCell>
                    <TableCell>{new Date(j.date_of_death).toLocaleDateString()}</TableCell>
                    <TableCell>{j.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
