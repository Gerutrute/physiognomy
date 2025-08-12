'use server';
/**
 * @fileOverview This file defines a Genkit flow for interpreting astrological data and providing a storytelling-based interpretation.
 *
 * - interpretAstrologicalData - A function that interprets astrological data and generates a narrative.
 * - InterpretAstrologicalDataInput - The input type for the interpretAstrologicalData function.
 * - InterpretAstrologicalDataOutput - The return type for the interpretAstrologicalData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretAstrologicalDataInputSchema = z.object({
  birthDate: z.string().describe('The user\u0027s birth date (YYYY-MM-DD).'),
  birthTime: z.string().describe('The user\u0027s birth time (HH:MM).'),
  birthLocation: z.string().describe('The user\u0027s birth location.'),
  matchedCelebrity: z.string().describe('The name of the matched celebrity.'),
  celebrityAstrologicalData: z.string().describe('The astrological data of the matched celebrity.'),
  userAstrologicalData: z.string().describe('The user\u0027s astrological data.'),
});
export type InterpretAstrologicalDataInput = z.infer<typeof InterpretAstrologicalDataInputSchema>;

const InterpretAstrologicalDataOutputSchema = z.object({
  interpretation: z.string().describe('A storytelling-based interpretation of the user\u0027s astrological data, relating it to the matched celebrity, in Korean.\n'),
});
export type InterpretAstrologicalDataOutput = z.infer<typeof InterpretAstrologicalDataOutputSchema>;

export async function interpretAstrologicalData(input: InterpretAstrologicalDataInput): Promise<InterpretAstrologicalDataOutput> {
  return interpretAstrologicalDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretAstrologicalDataPrompt',
  input: {schema: InterpretAstrologicalDataInputSchema},
  output: {schema: InterpretAstrologicalDataOutputSchema},
  prompt: `You are an expert astrologer and storyteller. You will provide a storytelling-based interpretation of the user\u0027s astrological data, relating it to the matched celebrity. The output must be in Korean.

User Birth Date: {{{birthDate}}}
User Birth Time: {{{birthTime}}}
User Birth Location: {{{birthLocation}}}
Matched Celebrity: {{{matchedCelebrity}}}
Celebrity Astrological Data: {{{celebrityAstrologicalData}}}
User Astrological Data: {{{userAstrologicalData}}}

Based on this information, create a compelling narrative that highlights the user\u0027s potential and destiny, drawing parallels to the matched celebrity\u0027s achievements.  For example, \"{{{matchedCelebrity}}}님과 비슷한 별자리를 가진 당신은, 분야에서 선구자가 될 잠재력을 가지고 있습니다. 만약 같은 시대에 데뷔했다면, {{{matchedCelebrity}}}님처럼 빛났을 것입니다.\"  The interpretation should be engaging and insightful, and in Korean.
`,
});

const interpretAstrologicalDataFlow = ai.defineFlow(
  {
    name: 'interpretAstrologicalDataFlow',
    inputSchema: InterpretAstrologicalDataInputSchema,
    outputSchema: InterpretAstrologicalDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
