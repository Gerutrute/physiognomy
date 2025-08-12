'use server';

/**
 * @fileOverview Generates astrological data for charts.
 *
 * - generateAstrologicalVisualizations - A function that handles the generation of astrological data.
 * - GenerateAstrologicalVisualizationsInput - The input type for the generateAstrologicalVisualizations function.
 * - GenerateAstrologicalVisualizationsOutput - The return type for the generateAstrologicalVisualizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAstrologicalVisualizationsInputSchema = z.object({
  birthDate: z
    .string()
    .describe('The user birth date in ISO format (YYYY-MM-DD).'),
  birthTime: z
    .string()
    .describe('The user birth time in HH:mm format.'),
  birthLocation: z
    .string()
    .describe('The user birth location (e.g., city, country).'),
});
export type GenerateAstrologicalVisualizationsInput = z.infer<
  typeof GenerateAstrologicalVisualizationsInputSchema
>;

const ChartDataPointSchema = z.object({
  label: z.string().describe('The label for the data point (e.g., month, year).'),
  value: z.number().describe('The value for the data point.'),
});

const GenerateAstrologicalVisualizationsOutputSchema = z.object({
  fortuneCurve: z
    .array(ChartDataPointSchema)
    .describe(
      'An array of data points for the fortune curve graph. This visualization illustrates the user fortune trend over time.'
    ),
  wealthIndex: z.array(ChartDataPointSchema).describe('An array of data points for the wealth index graph.'),
  affectionIndex: z.array(ChartDataPointSchema).describe('An array of data points for the affection index graph.'),
  healthIndex: z.array(ChartDataPointSchema).describe('An array of data points for the health index graph.'),
  careerPersona: z
    .string()
    .describe(
      'A description of a suitable career persona (e.g., 배우, 음악가, 운동선수) based on the user astrological data, in Korean.'
    ),
});
export type GenerateAstrologicalVisualizationsOutput = z.infer<
  typeof GenerateAstrologicalVisualizationsOutputSchema
>;

export async function generateAstrologicalVisualizations(
  input: GenerateAstrologicalVisualizationsInput
): Promise<GenerateAstrologicalVisualizationsOutput> {
  return generateAstrologicalVisualizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAstrologicalVisualizationsPrompt',
  input: {schema: GenerateAstrologicalVisualizationsInputSchema},
  output: {schema: GenerateAstrologicalVisualizationsOutputSchema},
  prompt: `Given the astrological data of a user, generate chart data and a career persona. The output must be in Korean.

User Birth Date: {{{birthDate}}}
User Birth Time: {{{birthTime}}}
User Birth Location: {{{birthLocation}}}

Instructions:
1.  Generate data points for a fortune curve graph visualizing the user fortune trend over the next 12 months.
2.  Generate data points for a wealth index graph with 5-7 data points on different financial aspects.
3.  Generate data points for an affection index graph with 5-7 data points on different relationship aspects.
4.  Generate data points for a health index graph with 5-7 data points on different well-being aspects.
5.  Based on the user's astrological data, suggest a suitable career persona (e.g., 배우, 음악가, 운동선수) in Korean.
`,
});

const generateAstrologicalVisualizationsFlow = ai.defineFlow(
  {
    name: 'generateAstrologicalVisualizationsFlow',
    inputSchema: GenerateAstrologicalVisualizationsInputSchema,
    outputSchema: GenerateAstrologicalVisualizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
