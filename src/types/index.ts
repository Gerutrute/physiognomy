import type { GenerateAstrologicalVisualizationsOutput } from '@/ai/flows/generate-astrological-visualizations';
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
  visualizations: GenerateAstrologicalVisualizationsOutput | null;
  userInput: UserInput;
};
