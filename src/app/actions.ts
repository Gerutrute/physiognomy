'use server';

import type { UserInput, ReportData } from '@/types';
import { generateAstrologicalVisualizations } from '@/ai/flows/generate-astrological-visualizations';
import { interpretAstrologicalData } from '@/ai/flows/interpret-astrological-data';
import { matchUserWithCelebrity } from '@/ai/flows/match-user-with-celebrity';
import { format } from 'date-fns';

export async function getAstrologyReport(
  userInput: UserInput
): Promise<ReportData | null> {
  try {
    const birthDateStr = format(userInput.birthDate, 'yyyy-MM-dd');

    const [matchResult, vizResult] = await Promise.all([
      matchUserWithCelebrity({
        photoDataUri: userInput.photoDataUri,
        birthDate: birthDateStr,
        birthTime: userInput.birthTime,
        birthLocation: userInput.birthLocation,
      }),
      generateAstrologicalVisualizations({
        birthDate: birthDateStr,
        birthTime: userInput.birthTime,
        birthLocation: userInput.birthLocation,
      }),
    ]);

    if (!matchResult || !vizResult) {
      throw new Error('Failed to get match or visualization results');
    }

    const interpretationResult = await interpretAstrologicalData({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
      matchedCelebrity: matchResult.celebrityMatch,
      // These are placeholders as the AI flows don't provide this detailed data.
      // The prompt is flexible enough to handle this.
      celebrityAstrologicalData: `Astrological data for ${matchResult.celebrityMatch}`,
      userAstrologicalData: `Astrological data for user born on ${birthDateStr}`,
    });
    
    if (!interpretationResult) {
      throw new Error('Failed to get interpretation result');
    }

    return {
      match: matchResult,
      visualizations: vizResult,
      interpretation: interpretationResult,
      userInput,
    };
  } catch (error) {
    console.error('Error generating astrology report:', error);
    return null;
  }
}
