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
      throw new Error('Failed to get match result');
    }

    const isFaceRecognitionFailure = matchResult.celebrityMatch === '얼굴 인식 불가';

    const vizResult = await generateAstrologicalVisualizations({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
      matchedCelebrity: isFaceRecognitionFailure ? '' : matchResult.celebrityMatch,
    });

    if (!vizResult) {
      throw new Error('Failed to get visualization results');
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
