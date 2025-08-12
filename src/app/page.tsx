"use client";

import { useState } from 'react';
import type { UserInput, ReportData } from '@/types';
import { getAstrologyReport } from '@/app/actions';

import { UserInputForm } from '@/components/user-input-form';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from "@/hooks/use-toast";

type View = 'form' | 'loading' | 'results';

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: UserInput) => {
    setView('loading');
    try {
      const result = await getAstrologyReport(data);
      if (result) {
        setReportData(result);
        setView('results');
      } else {
        throw new Error('결과를 생성하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "점성술 보고서를 생성하는 동안 오류가 발생했습니다. 나중에 다시 시도해주세요.",
      });
      setView('form');
    }
  };

  const handleReset = () => {
    setView('form');
    setReportData(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 transition-all duration-500">
      {view === 'loading' && <LoadingSpinner />}
      
      <div className={`w-full transition-opacity duration-500 ${view === 'form' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {view === 'form' && <UserInputForm onSubmit={handleFormSubmit} />}
      </div>

      <div className={`w-full transition-opacity duration-500 ${view === 'results' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {view === 'results' && reportData && (
          <ResultsDisplay data={reportData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
