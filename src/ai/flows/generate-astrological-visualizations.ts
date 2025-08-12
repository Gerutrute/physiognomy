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
  matchedCelebrity: z.string().describe('The name of the matched celebrity.'),
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
  interpretation: z.string().describe('사용자의 점성술 데이터를 기반으로 한 스토리텔링 형식의 운명 해석. 사용자와 매칭된 연예인을 관련지어 설명해야 합니다 (한국어로 작성).'),
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
  prompt: `You are an expert astrologer and storyteller. Given the astrological data of a user, generate chart data, a career persona, and a destiny interpretation. The output must be in Korean.

User Birth Date: {{{birthDate}}}
User Birth Time: {{{birthTime}}}
User Birth Location: {{{birthLocation}}}
Matched Celebrity: {{{matchedCelebrity}}}

Instructions:
1.  Generate data points for a fortune curve graph visualizing the user's fortune trend over the next 12 months. Labels should be months (e.g., '1월', '2월').
2.  Generate data points for a wealth index graph with 5-7 data points on different financial aspects (e.g., '수입', '저축', '투자').
3.  Generate data points for an affection index graph with 5-7 data points on different relationship aspects (e.g., '연인', '친구', '가족').
4.  Generate data points for a health index graph with 5-7 data points on different well-being aspects (e.g., '체력', '정신', '활력').
5.  Based on the user's astrological data, suggest a suitable career persona (e.g., 배우, 음악가, 운동선수) in Korean.
6.  Create a compelling narrative that highlights the user's potential and destiny, drawing parallels to the matched celebrity's achievements if a celebrity is provided. If no celebrity is matched (matchedCelebrity is empty), provide a general destiny interpretation. For example, "당신은 OOO와 같은 '불꽃형 리더' 운명을 가지고 있습니다." 또는 "이 시기에 데뷔했다면 ○○처럼 빛났을 가능성이 있습니다." The interpretation should be engaging, insightful, and in Korean.
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
