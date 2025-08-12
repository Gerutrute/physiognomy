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
        const isFaceRecognitionFailure = result.match.celebrityMatch === '얼굴 인식 불가';
        
        // 얼굴 인식 실패 시 사용자에게 알립니다.
        if (isFaceRecognitionFailure) {
          toast({
            variant: 'destructive',
            title: '얼굴 인식 실패',
            description: result.match.fortuneSimilarity,
          });
          // 결과는 계속 보여줍니다.
        }

        // 시각화 데이터 생성만 실패한 경우, 부분 결과를 보여줍니다.
        if (!result.visualizations) {
            toast({
                variant: 'default',
                title: '부분 결과 생성',
                description: '점성술 데이터를 생성하는 데 실패했습니다. 연예인 매칭 결과만 표시합니다.',
            });
        }

        setReportData(result);
        setView('results');

      } else {
        // getAstrologyReport가 null을 반환한 최악의 경우
        throw new Error('결과를 생성하는 데 실패했습니다. AI 모델이 응답하지 않았거나 네트워크 문제가 발생했을 수 있습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: `점성술 보고서를 생성하는 동안 오류가 발생했습니다: ${errorMessage}`,
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
