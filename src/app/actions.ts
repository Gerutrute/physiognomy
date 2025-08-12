'use server';

import type { UserInput, ReportData } from '@/types';
import { generateAstrologicalVisualizations } from '@/ai/flows/generate-astrological-visualizations';
import { matchUserWithCelebrity } from '@/ai/flows/match-user-with-celebrity';
import { format } from 'date-fns';

export async function getAstrologyReport(
  userInput: UserInput
): Promise<ReportData | null> {
  try {
    const birthDateStr = format(userInput.birthDate, 'yyyy-MM-dd');

    let matchResult = await matchUserWithCelebrity({
      photoDataUri: userInput.photoDataUri,
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
    });

    // matchUserWithCelebrity가 실패하여 null을 반환하면 얼굴 인식 실패로 간주하고 기본값을 채웁니다.
    if (!matchResult) {
      console.error('Failed to get match result from AI. Treating as face recognition failure.');
      matchResult = {
        celebrityMatch: '얼굴 인식 불가',
        matchPercentage: 0,
        fortuneSimilarity: '사진에서 얼굴을 찾을 수 없거나 분석 중 오류가 발생했습니다. 다른 사진으로 시도해 보세요.',
        celebrityPhotoUrl: 'https://placehold.co/400x400.png'
      };
    }
    
    // 얼굴 인식이 실패한 경우(API가 '얼굴 인식 불가'를 명시적으로 반환하거나, API 호출 자체가 실패한 경우), 
    // 여기서 처리를 중단하고 부분적인 결과만 반환합니다.
    const isFaceRecognitionFailure = matchResult.celebrityMatch === '얼굴 인식 불가';
    if (isFaceRecognitionFailure) {
        return {
            match: matchResult,
            visualizations: null, // 시각화 데이터는 없음
            userInput,
        }
    }

    // 얼굴 인식이 성공했을 때만 시각화 데이터를 요청합니다.
    const vizResult = await generateAstrologicalVisualizations({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
      matchedCelebrity: matchResult.celebrityMatch,
    });

    // 시각화 데이터 생성에 실패하더라도, 매칭 결과는 보여주기 위해 null 대신 기본 객체를 반환합니다.
    if (!vizResult) {
        console.error('Failed to get visualization result from AI.');
        return {
          match: matchResult,
          visualizations: null,
          userInput,
        };
    }
    
    // 모든 데이터가 성공적으로 생성된 경우
    return {
      match: matchResult,
      visualizations: vizResult,
      userInput,
    };

  } catch (error) {
    console.error('Error generating astrology report:', error);
    // 예기치 않은 최상위 오류 발생 시 null 반환
    return null;
  }
}
