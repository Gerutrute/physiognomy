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

    const matchResult = await matchUserWithCelebrity({
      photoDataUri: userInput.photoDataUri,
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
    });

    if (!matchResult) {
      throw new Error('Failed to get match result');
    }

    // 얼굴 인식이 실패하더라도 다른 데이터는 계속 진행
    if (matchResult.celebrityMatch === '얼굴 인식 불가') {
       return {
        match: matchResult,
        visualizations: {
          fortuneCurve: [],
          wealthIndex: [],
          affectionIndex: [],
          healthIndex: [],
          careerPersona: '',
        },
        interpretation: {
          interpretation: '',
        },
        userInput,
      };
    }

    const vizResult = await generateAstrologicalVisualizations({
      birthDate: birthDateStr,
      birthTime: userInput.birthTime,
      birthLocation: userInput.birthLocation,
    });

    if (!vizResult) {
      throw new Error('Failed to get visualization results');
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
