'use server';

/**
 * @fileOverview Performs a machine learning-style analysis on user data.
 *
 * - performMlAnalysis - A function that handles the analysis process.
 * - PerformMlAnalysisInput - The input type for the performMlAnalysis function.
 * - PerformMlAnalysisOutput - The return type for the performMlAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformMlAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
});
export type PerformMlAnalysisInput = z.infer<typeof PerformMlAnalysisInputSchema>;

const PersonalityTraitSchema = z.object({
    trait: z.enum(['개방성', '성실성', '외향성', '친화성', '신경성']).describe('The personality trait name (Big Five).'),
    score: z.number().min(0).max(100).describe('The score for the trait, from 0 to 100.'),
    description: z.string().describe('A brief description of the trait score in Korean.'),
});

const PerformMlAnalysisOutputSchema = z.object({
  personalityAnalysis: z.array(PersonalityTraitSchema).length(5).describe('An array of 5 personality trait analyses based on the Big Five model.'),
  successPrediction: z.string().describe('A prediction of the user\'s potential success path, written in an encouraging and insightful tone (in Korean).'),
});
export type PerformMlAnalysisOutput = z.infer<typeof PerformMlAnalysisOutputSchema>;

export async function performMlAnalysis(input: PerformMlAnalysisInput): Promise<PerformMlAnalysisOutput> {
  return performMlAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performMlAnalysisPrompt',
  input: {schema: PerformMlAnalysisInputSchema},
  output: {schema: PerformMlAnalysisOutputSchema},
  prompt: `You are a sophisticated AI that performs machine learning analysis to predict personality and success.
Based on the provided user photo and birth date, perform a detailed analysis.

User Photo: {{media url=photoDataUri}}
Birth Date: {{{birthDate}}}

Your tasks are to:
1.  **Analyze Personality Traits**: Based on the photo, analyze the user's personality according to the Big Five model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism). Provide a score from 0-100 for each of the 5 traits and a brief, insightful description for each in Korean. The Korean names for the traits are: '개방성', '성실성', '외향성', '친화성', '신경성'.
2.  **Predict Success Path**: Based on the combination of the personality analysis and the user's birth date (which you can interpret in a numerological or life-path context), provide a compelling and encouraging prediction about their potential path to success. This should be written in Korean.

Provide the response in the specified JSON format.
`,
});

const performMlAnalysisFlow = ai.defineFlow(
  {
    name: 'performMlAnalysisFlow',
    inputSchema: PerformMlAnalysisInputSchema,
    outputSchema: PerformMlAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
