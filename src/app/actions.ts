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

    let matchResult;
    try {
      matchResult = await matchUserWithCelebrity({
        photoDataUri: userInput.photoDataUri,
        birthDate: birthDateStr,
        birthTime: userInput.birthTime,
        birthLocation: userInput.birthLocation,
      });
    } catch (error) {
        console.error('Error in matchUserWithCelebrity flow:', error);
        matchResult = null; // Mark as failed
    }

    // If matching fails, create a default "failure" object
    if (!matchResult || matchResult.celebrityMatch === '얼굴 인식 불가') {
      matchResult = {
        celebrityMatch: '얼굴 인식 불가',
        matchPercentage: 0,
        fortuneSimilarity: '사진에서 얼굴을 찾을 수 없거나 분석 중 오류가 발생했습니다. 다른 사진으로 시도해 보세요.',
        celebrityPhotoUrl: 'https://placehold.co/400x400.png'
      };
    }

    // Generate visualizations regardless of match success
    let vizResult = null;
    try {
        vizResult = await generateAstrologicalVisualizations({
            birthDate: birthDateStr,
            birthTime: userInput.birthTime,
            birthLocation: userInput.birthLocation,
            matchedCelebrity: matchResult.celebrityMatch === '얼굴 인식 불가' ? '' : matchResult.celebrityMatch,
        });
    } catch(error) {
        console.error('Error in generateAstrologicalVisualizations flow:', error);
        vizResult = null;
    }

    // Always return a result object. The UI will adapt based on what data is available.
    return {
      match: matchResult,
      visualizations: vizResult,
      userInput,
    };

  } catch (error) {
    console.error('Critical error in getAstrologyReport:', error);
    return null;
  }
}
