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
    
    // 얼굴 인식이 실패한 경우, 여기서 처리를 중단하고 결과를 반환하여
    // 프론트엔드에서 사용자에게 알릴 수 있도록 합니다.
    const isFaceRecognitionFailure = matchResult.celebrityMatch === '얼굴 인식 불가';
    if (isFaceRecognitionFailure) {
        return {
            match: matchResult,
            visualizations: null, // 시각화 데이터는 없음
            userInput,
        }
    }

    const vizResult = await generateAstrologicalVisualizations({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
      matchedCelebrity: matchResult.celebrityMatch,
    });

    if (!vizResult) {
        console.error('Failed to get visualization result from AI.');
        // 시각화 데이터 생성에 실패하더라도 매칭 결과는 보여줍니다.
        return {
          match: matchResult,
          visualizations: null,
          userInput,
        };
    }
    
    return {
      match: matchResult,
      visualizations: vizResult,
      userInput,
    };

  } catch (error) {
    console.error('Error generating astrology report:', error);
    return null;
  }
}
