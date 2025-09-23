
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GazaCasualty } from '@/lib/data';

const TOTAL_PAGES = 602; // As per API documentation, will need dynamic update later

export default function VictimsTable() {
  const [victims, setVictims] = useState<GazaCasualty[]>([]);
  const [filteredVictims, setFilteredVictims] = useState<GazaCasualty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    async function fetchData() {
      if (page > TOTAL_PAGES) {
        setHasMore(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`https://data.techforpalestine.org/api/v2/killed-in-gaza/page-${page}.json`);
        if (!res.ok) {
          throw new Error(`Failed to fetch page ${page}`);
        }
        const newVictims: GazaCasualty[] = await res.json();
        setVictims(prev => [...prev, ...newVictims]);
        setHasMore(newVictims.length > 0 && page < TOTAL_PAGES);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    const results = victims.filter(v =>
      v.en_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVictims(results);
  }, [searchTerm, victims]);

  if (error && victims.length === 0) {
    return <div className="text-center text-red-500">Error loading data: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Victims in Gaza</CardTitle>
        <CardDescription>
          A list of {victims.length.toLocaleString()} known victims since October 7th, 2023.
        </CardDescription>
         <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (English)</TableHead>
                  <TableHead>Name (Arabic)</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Sex</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVictims.map((v, index) => {
                  const isLastElement = index === filteredVictims.length - 1;
                  return (
                    <TableRow ref={isLastElement ? lastElementRef : null} key={v.id || index}>
                      <TableCell className="font-medium">{v.en_name}</TableCell>
                      <TableCell className="font-medium text-right" dir="rtl">{v.name}</TableCell>
                      <TableCell>{v.age !== null ? v.age : 'N/A'}</TableCell>
                      <TableCell>{v.sex === 'm' ? 'Male' : 'Female'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
             {loading && (
              <div className="space-y-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
            {!hasMore && victims.length > 0 && <p className="text-center text-muted-foreground p-4">End of list.</p>}
          </ScrollArea>
      </CardContent>
    </Card>
  );
}
