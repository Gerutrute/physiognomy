"use client";

import type { ReportData } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, BrainCircuit, Instagram, Share2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

type ResultsDisplayProps = {
  data: ReportData;
  onReset: () => void;
};

const chartConfig = {
  value: {
    label: 'Value',
  },
  score: {
    label: 'Score',
    color: 'hsl(var(--accent))',
  }
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28'];


const StatChart = ({ title, data, type }: { title: string; data: { label: string; value: number }[]; type: 'bar' | 'line' | 'pie' }) => (
    <Card className="text-center bg-secondary/50 flex flex-col">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="w-full h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' && (
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltipContent />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            )}
             {type === 'line' && (
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                    <ChartTooltipContent />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
            )}
            {type === 'pie' && (
                <PieChart>
                    <ChartTooltipContent />
                    <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={60} >
                         {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
);


export function ResultsDisplay({ data, onReset }: ResultsDisplayProps) {
  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  const isFaceRecognitionFailure = !data.match || data.match.celebrityMatch === '얼굴 인식 불가';

  const personalityData = data.mlAnalysis?.personalityAnalysis.map(item => ({
      subject: item.trait,
      score: item.score,
      fullMark: 100,
  }));

  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12">
      <Button onClick={onReset} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        다시 분석하기
      </Button>

      <div className="space-y-8">
        {/* Celebrity Match Card */}
        {!isFaceRecognitionFailure && data.match && (
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
                   <AvatarImage src={data.match.celebrityPhotoUrl} alt={data.match.celebrityMatch} data-ai-hint="celebrity portrait" />
                  <AvatarFallback className="text-3xl bg-accent/20 text-accent">{getInitials(data.match.celebrityMatch)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold">{data.match.celebrityMatch}</h3>
              </div>
            </CardContent>
          </Card>
        )}

        {data.visualizations && (
          <>
            {/* Storytelling Card */}
            <Card>
               <CardHeader>
                 <CardTitle className="font-headline text-2xl text-primary">
                    📖 당신의 운명 이야기
                 </CardTitle>
                 <CardDescription>
                    {isFaceRecognitionFailure || !data.match
                      ? "AI 점성술사가 당신의 운명을 해석했습니다."
                      : `AI 점성술사가 ${data.match.celebrityMatch}님과의 비교를 통해 당신의 운명을 해석했습니다.`
                    }
                 </CardDescription>
               </CardHeader>
               <CardContent className="text-lg leading-relaxed prose prose-p:text-foreground">
                 <p>{data.visualizations.interpretation}</p>
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <StatChart title="운세 곡선" data={data.visualizations.fortuneCurve} type="line" />
                 <StatChart title="재물 지수" data={data.visualizations.wealthIndex} type="bar" />
                 <StatChart title="애정 지수" data={data.visualizations.affectionIndex} type="pie" />
                 <StatChart title="건강 지수" data={data.visualizations.healthIndex} type="bar" />
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 pt-4 border-t mt-4">
                  <h4 className="font-bold text-muted-foreground">추천 직업 페르소나</h4>
                  <p className="font-headline text-xl text-accent">{data.visualizations.careerPersona}</p>
              </CardFooter>
            </Card>
          </>
        )}

        {/* ML Analysis Card */}
        {data.mlAnalysis && personalityData && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <BrainCircuit />
                ML 성격 & 성공 분석 리포트
              </CardTitle>
              <CardDescription>
                AI 머신러닝이 당신의 성격 특성과 성공 가능성을 분석했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="font-bold text-center mb-2 text-muted-foreground">Big 5 성격 특성</h4>
                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <ResponsiveContainer>
                    <RadarChart data={personalityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                      <ChartTooltipContent />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-4">
                  {data.mlAnalysis.personalityAnalysis.map((trait) => (
                      <div key={trait.trait}>
                          <p className="font-bold">{trait.trait} ({trait.score}점)</p>
                          <p className="text-sm text-muted-foreground">{trait.description}</p>
                      </div>
                  ))}
              </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 pt-4 border-t mt-4">
                  <h4 className="font-bold text-muted-foreground">성공 경로 예측</h4>
                  <p className="text-lg text-primary">{data.mlAnalysis.successPrediction}</p>
              </CardFooter>
          </Card>
        )}

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
