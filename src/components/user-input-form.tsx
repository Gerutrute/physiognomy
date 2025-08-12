"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';

import type { UserInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Logo } from './icons/logo';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  birthDate: z.date({
    required_error: '생년월일을 선택해주세요.',
  }),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'HH:mm 형식으로 입력해주세요.'),
  birthLocation: z.string().min(1, '태어난 장소를 입력해주세요.'),
  photo: z.any().refine((files) => files?.length === 1, '사진을 업로드해주세요.'),
});

type UserInputFormProps = {
  onSubmit: (data: UserInput) => void;
};

export function UserInputForm({ onSubmit }: UserInputFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthTime: '12:00',
      birthLocation: '',
    },
  });

  const photoRef = form.register('photo');

  const processSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    const photoFile = values.photo[0];

    if (photoFile.size > 4 * 1024 * 1024) { // 4MB limit
      toast({
        variant: "destructive",
        title: "파일 크기 초과",
        description: "사진 파일은 4MB를 초과할 수 없습니다.",
      });
      setIsSubmitting(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(photoFile);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        toast({
          variant: "destructive",
          title: "파일 오류",
          description: "사진 파일을 읽는 중 오류가 발생했습니다.",
        });
        setIsSubmitting(false);
        return;
      }

      const userInput: UserInput = {
        name: values.name,
        birthDate: values.birthDate,
        birthTime: values.birthTime,
        birthLocation: values.birthLocation,
        photoDataUri: reader.result,
      };
      onSubmit(userInput);
    };
    reader.onerror = () => {
      toast({
          variant: "destructive",
          title: "파일 오류",
          description: "사진 파일을 읽는 중 오류가 발생했습니다.",
        });
      setIsSubmitting(false);
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="flex flex-col items-center justify-center text-center mb-8">
          <Logo className="w-12 h-12 text-primary mb-2" />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-6xl">
            니팔자야
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            AI가 찾아주는 당신의 연예인 도플갱어와 숨겨진 운명
          </p>
      </div>

      <Card className="shadow-2xl shadow-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">운명 분석 시작하기</CardTitle>
          <CardDescription>당신의 정보를 입력하여 AI 분석을 시작하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>생년월일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>태어난 시간</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="birthLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>태어난 장소</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 서울특별시" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정면 사진 업로드</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          className="hidden"
                          id="photo-upload"
                          {...photoRef}
                           onChange={(e) => {
                              field.onChange(e.target.files);
                              setFileName(e.target.files?.[0]?.name || '');
                           }}
                        />
                        <label htmlFor="photo-upload" className="flex-grow">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            <span>{fileName || '사진 파일 선택'}</span>
                          </Button>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full !mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  'AI로 내 운명 분석하기'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
