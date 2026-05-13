
'use server';
/**
 * @fileOverview An AI agent that recommends suitable facilities based on natural language requests.
 *
 * - recommendFacility - A function that handles the facility recommendation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Mock facility data aligned with the latest school inventory.
 */
const MOCK_FACILITIES = [
  { id: 'R101', name: 'Room 101', capacity: 40, equipment: ['Whiteboard', 'Smart TV', 'Wi-Fi'], purpose: 'Classroom' },
  { id: 'R102', name: 'Room 102', capacity: 35, equipment: ['Whiteboard', 'Projector', 'Wi-Fi'], purpose: 'Classroom' },
  { id: 'R201', name: 'Room 201', capacity: 60, equipment: ['Large Whiteboard', 'Smart TV', 'Wi-Fi'], purpose: 'Classroom' },
  { id: 'TH-01', name: 'Theater 1', capacity: 500, equipment: ['Sound System', 'Stage Lighting', 'Large Screen'], purpose: 'Theater' },
  { id: 'TH-02', name: 'Theater 2', capacity: 150, equipment: ['Surround Sound', 'Smart TV', 'Tiered Seating'], purpose: 'Theater' },
  { id: 'PE-01', name: 'PE Hall 1', capacity: 300, equipment: ['Basketball Hoops', 'Scoreboard'], purpose: 'PE Hall' },
  { id: 'CL-301', name: 'Lab 301', capacity: 35, equipment: ['35 PCs', 'High-speed Internet', 'Smart TV'], purpose: 'Computer Lab' },
  { id: 'CL-302', name: 'Lab 302', capacity: 40, equipment: ['40 PCs', 'Projector', 'Wi-Fi'], purpose: 'Computer Lab' },
];

const FacilityDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  equipment: z.array(z.string()),
  purpose: z.string(),
});

const RecommendFacilityInputSchema = z.object({
  userRequest: z.string().describe('Description of needs: category, chairs, equipment.'),
});

const RecommendedFacilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  equipment: z.array(z.string()),
  suitabilityReason: z.string().describe('Clear explanation of why this room fits the user requirements.'),
});

const RecommendFacilityOutputSchema = z.object({
  recommendations: z.array(RecommendedFacilitySchema),
  aiExplanation: z.string().describe('Summary of the AI analysis.'),
});

const findAvailableFacilities = ai.defineTool(
  {
    name: 'findAvailableFacilities',
    description: 'Finds rooms by category, min capacity, and equipment.',
    inputSchema: z.object({
      category: z.string().optional(),
      minCapacity: z.number().optional(),
      requiredEquipment: z.array(z.string()).optional(),
    }),
    outputSchema: z.array(FacilityDetailsSchema),
  },
  async (input) => {
    return MOCK_FACILITIES.filter(f => {
      const matchCat = !input.category || f.purpose === input.category;
      const matchCap = !input.minCapacity || f.capacity >= input.minCapacity;
      const matchEq = !input.requiredEquipment || input.requiredEquipment.every(req => 
        f.equipment.some(fe => fe.toLowerCase().includes(req.toLowerCase()))
      );
      return matchCat && matchCap && matchEq;
    }).slice(0, 3);
  }
);

const recommendFacilityPrompt = ai.definePrompt({
  name: 'recommendFacilityPrompt',
  input: { schema: RecommendFacilityInputSchema },
  output: { schema: RecommendFacilityOutputSchema },
  tools: [findAvailableFacilities],
  prompt: `You are the WhereTo Assistant for Gordon College.
Based on this request: "{{userRequest}}", find the best rooms.
1. Use findAvailableFacilities to get matches.
2. Recommend the best ones and explain WHY they are a good fit based on the user's specific requirements (chairs, TV, PCs, etc.).
`,
});

export async function recommendFacility(input: { userRequest: string }) {
  const { output } = await recommendFacilityPrompt(input);
  return output!;
}
