import { Logo } from '@/components/icons/logo';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <Logo className="mx-auto h-16 w-16 animate-pulse text-primary" />
        <h2 className="mt-4 font-headline text-3xl font-bold text-primary">
          운명 분석 중...
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          AI가 당신의 연예인 도플갱어를 찾고 운명을 해석하고 있습니다.
        </p>
      </div>
    </div>
  );
}
