import type { GenerateAstrologicalVisualizationsOutput } from '@/ai/flows/generate-astrological-visualizations';
import type { InterpretAstrologicalDataOutput } from '@/ai/flows/interpret-astrological-data';
import type { MatchUserWithCelebrityOutput } from '@/ai/flows/match-user-with-celebrity';

export type UserInput = {
  name: string;
  birthDate: Date;
  birthTime: string;
  birthLocation: string;
  photoDataUri: string;
};

export type ReportData = {
  match: MatchUserWithCelebrityOutput;
  visualizations: GenerateAstrologicalVisualizationsOutput;
  interpretation: InterpretAstrologicalDataOutput;
  userInput: UserInput;
};
