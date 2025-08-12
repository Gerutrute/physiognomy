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
  birthDate: z.string().describe("The user's birth date (YYYY-MM-DD)."),
  birthTime: z.string().describe("The user's birth time (HH:MM)."),
  birthLocation: z.string().describe("The user's birth location."),
});
export type MatchUserWithCelebrityInput = z.infer<typeof MatchUserWithCelebrityInputSchema>;

const MatchUserWithCelebrityOutputSchema = z.object({
  celebrityMatch: z.string().describe('사용자와 가장 유사한 연예인의 이름. 얼굴을 인식할 수 없는 경우 "얼굴 인식 불가"를 반환합니다.'),
  matchPercentage: z.number().describe('사용자와 연예인의 유사도 퍼센트. 얼굴을 인식할 수 없는 경우 0을 반환합니다.'),
  fortuneSimilarity: z.string().describe('운세 패턴의 유사성에 대한 설명. 얼굴을 인식할 수 없는 경우 "사진에서 얼굴을 찾을 수 없습니다. 더 선명한 정면 사진을 사용하거나 다른 사진으로 시도해 보세요."를 반환합니다.'),
  celebrityPhotoUrl: z.string().url().describe('일치하는 연예인의 사진 URL. 얼굴을 인식할 수 없는 경우, 자리 표시자 이미지 URL을 반환합니다.'),
});
export type MatchUserWithCelebrityOutput = z.infer<typeof MatchUserWithCelebrityOutputSchema>;

export async function matchUserWithCelebrity(input: MatchUserWithCelebrityInput): Promise<MatchUserWithCelebrityOutput> {
  return matchUserWithCelebrityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchUserWithCelebrityPrompt',
  input: {schema: MatchUserWithCelebrityInputSchema},
  output: {schema: MatchUserWithCelebrityOutputSchema},
  prompt: `You are an AI that finds the Korean celebrity that most resembles the person in the photo.

Based on the provided user photo and their birth information, find the Korean celebrity who looks the most similar to the user.
Also consider the user's astrological data (birth date, time, and location) to find similarities in their fortune patterns.

User Photo: {{media url=photoDataUri}}
Birth Date: {{{birthDate}}}
Birth Time: {{{birthTime}}}
Birth Location: {{{birthLocation}}}

Your task is to:
1. Identify the Korean celebrity that most closely resembles the person in the photo.
2. Calculate a match percentage based on visual and astrological similarities.
3. Provide a description of the similarities in their fortune patterns, in Korean.
4. Find a high-quality, publicly available photo URL for the matched celebrity.

If for any reason you absolutely cannot find a match, return "얼굴 인식 불가" for celebrityMatch, 0 for matchPercentage, an explanatory message in fortuneSimilarity, and a placeholder image URL for celebrityPhotoUrl.

Provide the response in the specified JSON format.
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
