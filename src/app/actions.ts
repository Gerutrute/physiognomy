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
      // Even if match fails, we can proceed if we have a default or allow it
      throw new Error('Failed to get match result');
    }

    const isFaceRecognitionFailure = matchResult.celebrityMatch === '얼굴 인식 불가';

    const vizResult = await generateAstrologicalVisualizations({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
      matchedCelebrity: isFaceRecognitionFailure ? '얼굴 인식 불가' : matchResult.celebrityMatch,
    });

    if (!vizResult) {
      throw new Error('Failed to get visualization results');
    }
    
    // If face recognition failed, we still want to return the other data
    if (isFaceRecognitionFailure) {
       return {
        match: matchResult,
        visualizations: vizResult,
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
