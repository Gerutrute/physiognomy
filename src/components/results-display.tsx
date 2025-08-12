"use client";

import type { ReportData } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Instagram, Share2 } from 'lucide-react';

type ResultsDisplayProps = {
  data: ReportData;
  onReset: () => void;
};

const StatCard = ({ title, value, children }: { title: string, value: string, children: React.ReactNode }) => (
  <Card className="text-center bg-secondary/50">
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="font-headline text-accent">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export function ResultsDisplay({ data, onReset }: ResultsDisplayProps) {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12">
      <Button onClick={onReset} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        다시 분석하기
      </Button>

      <div className="space-y-8">
        {/* Celebrity Match Card */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
              당신과 꼭 닮은 연예인은...
            </CardTitle>
            <CardDescription className="text-lg">
              얼굴, 성격, 운세 패턴을 분석한 결과입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-24 h-24 border-4 border-muted">
                <AvatarImage src={data.userInput.photoDataUri} alt={data.userInput.name} data-ai-hint="portrait person" />
                <AvatarFallback className="text-3xl bg-secondary">{getInitials(data.userInput.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold">{data.userInput.name}</h3>
            </div>
            
            <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">일치율</p>
                <p className="font-headline text-6xl font-bold text-accent">
                    {data.match.matchPercentage}%
                </p>
                <div className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: data.match.fortuneSimilarity.replace(/\n/g, '<br />') }} />
            </div>

            <div className="flex flex-col items-center gap-2">
               <Avatar className="w-24 h-24 border-4 border-accent">
                <AvatarImage src={`https://placehold.co/100x100.png`} alt={data.match.celebrityMatch} data-ai-hint="celebrity portrait" />
                <AvatarFallback className="text-3xl bg-accent/20 text-accent">{getInitials(data.match.celebrityMatch)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold">{data.match.celebrityMatch}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Storytelling Card */}
        <Card>
           <CardHeader>
             <CardTitle className="font-headline text-2xl text-primary">
                📖 당신의 운명 이야기
             </CardTitle>
             <CardDescription>
                AI 점성술사가 {data.match.celebrityMatch}님과의 비교를 통해 당신의 운명을 해석했습니다.
             </CardDescription>
           </CardHeader>
           <CardContent className="text-lg leading-relaxed prose prose-p:text-foreground">
             <p>{data.interpretation.interpretation}</p>
           </CardContent>
        </Card>
        
        {/* Astrological Visualizations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">
              ✨ 당신의 잠재력 지수
            </CardTitle>
            <CardDescription>
              당신의 생년월일시를 기반으로 분석된 다양한 잠재력 지표입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="운세 곡선" value="보기">
               <Image src={data.visualizations.fortuneCurve} width={200} height={150} alt="Fortune Curve Graph" className="rounded-lg mx-auto" data-ai-hint="abstract graph" />
            </StatCard>
            <StatCard title="재물 지수" value="보기">
              <Image src={data.visualizations.wealthIndex} width={200} height={150} alt="Wealth Index Graph" className="rounded-lg mx-auto" data-ai-hint="finance chart" />
            </StatCard>
            <StatCard title="애정 지수" value="보기">
              <Image src={data.visualizations.affectionIndex} width={200} height={150} alt="Affection Index Graph" className="rounded-lg mx-auto" data-ai-hint="heart graph" />
            </StatCard>
            <StatCard title="건강 지수" value="보기">
              <Image src={data.visualizations.healthIndex} width={200} height={150} alt="Health Index Graph" className="rounded-lg mx-auto" data-ai-hint="health chart" />
            </StatCard>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
              <h4 className="font-bold text-muted-foreground">추천 직업 페르소나</h4>
              <p className="font-headline text-xl text-accent">{data.visualizations.careerPersona}</p>
          </CardFooter>
        </Card>

        {/* Share Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">결과 공유하기</CardTitle>
            <CardDescription>분석 결과를 친구들에게 공유하고 비교해보세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-4">
            <Button size="lg" variant="outline">
              <Share2 className="mr-2 h-5 w-5" />
              링크로 공유
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Instagram className="mr-2 h-5 w-5" />
              인스타그램 공유
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
