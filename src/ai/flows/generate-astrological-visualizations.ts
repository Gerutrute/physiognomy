'use server';

/**
 * @fileOverview Generates visually appealing astrological chart graphs.
 *
 * - generateAstrologicalVisualizations - A function that handles the generation of astrological visualizations.
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
  interests: z
    .string()
    .describe('Comma separated list of user interests (e.g., music, sports, technology).'),
});
export type GenerateAstrologicalVisualizationsInput = z.infer<
  typeof GenerateAstrologicalVisualizationsInputSchema
>;

const GenerateAstrologicalVisualizationsOutputSchema = z.object({
  fortuneCurve: z
    .string()
    .describe(
      'A data URI of an image representing the fortune curve graph as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' + 
        'This visualization illustrates the user fortune trend over time.'
    ),
  wealthIndex: z
    .string()
    .describe(
      'A data URI of an image representing the wealth index graph as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' +
        'This visualization indicates the user potential for wealth.'
    ),
  affectionIndex: z
    .string()
    .describe(
      'A data URI of an image representing the affection index graph as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' +
        'This visualization indicates the user potential for affection and relationships.'
    ),
  healthIndex: z
    .string()
    .describe(
      'A data URI of an image representing the health index graph as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' +
        'This visualization indicates the user potential for health and well-being.'
    ),
  careerPersona: z
    .string()
    .describe(
      'A description of a suitable career persona (e.g., actor, musician, athlete) based on the user interests.'
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
  prompt: `Given the astrological data and interests of a user, generate visually appealing graphs and a career persona.

User Birth Date: {{{birthDate}}}
User Birth Time: {{{birthTime}}}
User Birth Location: {{{birthLocation}}}
User Interests: {{{interests}}}

Instructions:
1.  Generate a fortune curve graph visualizing the user fortune trend over time.  Return the graph as a data URI.
2.  Generate a wealth index graph indicating the user potential for wealth.  Return the graph as a data URI.
3.  Generate an affection index graph indicating the user potential for affection and relationships. Return the graph as a data URI.
4.  Generate a health index graph indicating the user potential for health and well-being. Return the graph as a data URI.
5.  Based on the user interests, suggest a suitable career persona (e.g., actor, musician, athlete).

Output the results in the following JSON format:
{
  "fortuneCurve": "data:<mimetype>;base64,<encoded_data>",
  "wealthIndex": "data:<mimetype>;base64,<encoded_data>",
  "affectionIndex": "data:<mimetype>;base64,<encoded_data>",
  "healthIndex": "data:<mimetype>;base64,<encoded_data>",
  "careerPersona": "description of career persona"
}
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
