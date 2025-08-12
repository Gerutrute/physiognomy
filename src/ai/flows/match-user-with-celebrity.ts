'use server';
/**
 * @fileOverview Matches a user with a celebrity based on facial features, personality traits, and fortune patterns.
 *
 * - matchUserWithCelebrity - A function that handles the matching process.
 * - MatchUserWithCelebrityInput - The input type for the matchUserWithCelebrity function.
 * - MatchUserWithCelebrityOutput - The return type for the matchUserWithCelebrity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchUserWithCelebrityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  birthDate: z.string().describe('The user\'s birth date (YYYY-MM-DD).'),
  birthTime: z.string().describe('The user\'s birth time (HH:MM).'),
  birthLocation: z.string().describe('The user\'s birth location.'),
});
export type MatchUserWithCelebrityInput = z.infer<typeof MatchUserWithCelebrityInputSchema>;

const MatchUserWithCelebrityOutputSchema = z.object({
  celebrityMatch: z.string().describe('The name of the celebrity the user is most similar to.'),
  matchPercentage: z.number().describe('The percentage of similarity between the user and the celebrity.'),
  fortuneSimilarity: z.string().describe('A description of the similarities in fortune patterns.'),
});
export type MatchUserWithCelebrityOutput = z.infer<typeof MatchUserWithCelebrityOutputSchema>;

export async function matchUserWithCelebrity(input: MatchUserWithCelebrityInput): Promise<MatchUserWithCelebrityOutput> {
  return matchUserWithCelebrityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchUserWithCelebrityPrompt',
  input: {schema: MatchUserWithCelebrityInputSchema},
  output: {schema: MatchUserWithCelebrityOutputSchema},
  prompt: `You are an AI that matches users with celebrities based on their photo and birth information.

Analyze the user's photo and compare their facial features to a database of celebrity faces.
Consider personality traits derived from the user's astrology data (birth date, time, and location).
Evaluate overall fortune patterns based on astrological data.
Calculate an overall match score based on facial features, personality traits, and fortune patterns.

User Photo: {{media url=photoDataUri}}
Birth Date: {{{birthDate}}}
Birth Time: {{{birthTime}}}
Birth Location: {{{birthLocation}}}

Based on this information, determine the celebrity the user is most like and provide a match percentage and a description of the similarities in their fortune patterns.

Return the celebrityMatch, matchPercentage, and fortuneSimilarity in the proper JSON format.
`,
});

const matchUserWithCelebrityFlow = ai.defineFlow(
  {
    name: 'matchUserWithCelebrityFlow',
    inputSchema: MatchUserWithCelebrityInputSchema,
    outputSchema: MatchUserWithCelebrityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
