// src/hooks/useCombinedCasualties.ts
'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { DailyCasualtyEntry } from '@/lib/data';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Definisikan tipe data untuk hasil gabungan
export interface CombinedDailyData {
  date: string;
  total_cumulative_killed: number;
  gaza_cumulative_killed: number;
  west_bank_cumulative_killed: number;
  gaza_cumulative_injured: number;
  west_bank_cumulative_injured: number;
}

export function useCombinedCasualties() {
  // 1. Fetch kedua API secara paralel
  const { data: gazaData, error: gazaError, isLoading: gazaIsLoading } = useSWR<DailyCasualtyEntry[]>(
    'https://data.techforpalestine.org/api/v2/casualties_daily.min.json',
    fetcher
  );
  const { data: westBankData, error: westBankError, isLoading: westBankIsLoading } = useSWR<DailyCasualtyEntry[]>(
    'https://data.techforpalestine.org/api/v2/west_bank_daily.min.json',
    fetcher
  );

  // 2. Gunakan useMemo untuk memproses dan menggabungkan data hanya saat data sumber berubah
  const combinedData = useMemo(() => {
    if (!gazaData || !westBankData) return null;

    const dataMap = new Map<string, Partial<CombinedDailyData>>();

    // Proses data Gaza
    gazaData.forEach(day => {
      dataMap.set(day.report_date, {
        date: day.report_date,
        gaza_cumulative_killed: day.killed_total,
        gaza_cumulative_injured: day.injured_total,
      });
    });

    // Proses data West Bank dan gabungkan
    westBankData.forEach(day => {
      const existingData = dataMap.get(day.report_date) || { date: day.report_date };
      dataMap.set(day.report_date, {
        ...existingData,
        west_bank_cumulative_killed: day.killed_total,
        west_bank_cumulative_injured: day.injured_total,
      });
    });

    // Ubah map menjadi array, hitung total, dan urutkan berdasarkan tanggal
    const sortedAndCombined = Array.from(dataMap.values())
      .map(day => {
        const gazaKilled = day.gaza_cumulative_killed || 0;
        const westBankKilled = day.west_bank_cumulative_killed || 0;
        return {
          ...day,
          total_cumulative_killed: gazaKilled + westBankKilled,
        } as CombinedDailyData;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedAndCombined;
  }, [gazaData, westBankData]);

  return {
    data: combinedData,
    isLoading: gazaIsLoading || westBankIsLoading,
    error: gazaError || westBankError,
  };
}
