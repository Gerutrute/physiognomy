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

    const matchResult = await matchUserWithCelebrity({
      photoDataUri: userInput.photoDataUri,
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
    });

    if (!matchResult) {
      console.error('Failed to get match result from AI.');
      return null;
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
        return null;
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
