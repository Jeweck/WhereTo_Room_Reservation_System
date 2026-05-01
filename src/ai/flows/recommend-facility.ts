
'use server';
/**
 * @fileOverview An AI agent that recommends suitable facilities based on natural language requests.
 *
 * - recommendFacility - A function that handles the facility recommendation process.
 * - RecommendFacilityInput - The input type for the recommendFacility function.
 * - RecommendFacilityOutput - The return type for the recommendFacility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Mock facility data to simulate a database lookup.
 */
const MOCK_FACILITIES = [
  {
    id: 'F001',
    name: 'Main Auditorium',
    capacity: 200,
    equipment: ['projector', 'sound system', 'stage', 'microphones'],
    description: 'Large auditorium suitable for lectures, presentations, and events. Equipped with advanced audio-visual systems.',
    availableTimes: ['Mon 9-11 AM', 'Wed 1-3 PM'],
  },
  {
    id: 'F002',
    name: 'Conference Room A',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'conference phone', 'computers'],
    description: 'Medium-sized conference room perfect for meetings, seminars, and group work.',
    availableTimes: ['Tue 10-12 PM', 'Thu 3-5 PM'],
  },
  {
    id: 'F003',
    name: 'Study Room 101',
    capacity: 8,
    equipment: ['whiteboard', 'large monitor'],
    description: 'Small study room ideal for group study sessions or small team meetings.',
    availableTimes: ['Mon 1-4 PM', 'Fri 9-11 AM'],
  },
  {
    id: 'F004',
    name: 'Lecture Hall B',
    capacity: 100,
    equipment: ['projector', 'sound system', 'whiteboard'],
    description: 'Large lecture hall with tiered seating, suitable for classes and larger presentations.',
    availableTimes: ['Tue 9-11 AM', 'Thu 1-3 PM'],
  },
  {
    id: 'F005',
    name: 'Computer Lab C',
    capacity: 40,
    equipment: ['computers', 'projector', 'whiteboard'],
    description: 'Computer lab equipped with desktop computers and a projector for hands-on training sessions.',
    availableTimes: ['Wed 10-12 PM', 'Fri 2-4 PM'],
  },
];

const FacilityDetailsSchema = z.object({
  id: z.string().describe('Unique identifier for the facility.'),
  name: z.string().describe('Name of the facility.'),
  capacity: z.number().describe('Maximum capacity of the facility.'),
  equipment: z.array(z.string()).describe('List of available equipment (e.g., "projector", "whiteboard", "computers").'),
  description: z.string().describe('Brief description of the facility.'),
  availableTimes: z.array(z.string()).describe('List of simplified available time slots (e.g., "Mon 9-11 AM", "Tue 2-4 PM").'),
});
export type FacilityDetails = z.infer<typeof FacilityDetailsSchema>;

const RecommendFacilityInputSchema = z.object({
  userRequest: z.string().describe('Natural language description of the facility requirements (e.g., "a room for 30 people with a whiteboard and a projector for a seminar").'),
});
export type RecommendFacilityInput = z.infer<typeof RecommendFacilityInputSchema>;

const RecommendedFacilitySchema = z.object({
  id: z.string().describe('Unique identifier of the recommended facility.'),
  name: z.string().describe('Name of the recommended facility.'),
  capacity: z.number().describe('Capacity of the facility.'),
  equipment: z.array(z.string()).describe('Key equipment available in the facility that matches the request.'),
  availableTimes: z.array(z.string()).describe('Example available time slots.'),
  suitabilityReason: z.string().describe('Explanation why this facility is suitable for the user\'s request, based on the identified criteria.'),
});

const RecommendFacilityOutputSchema = z.object({
  recommendations: z.array(RecommendedFacilitySchema).describe('List of recommended facilities that best match the user\'s request.'),
  aiExplanation: z.string().describe('An overall explanation from the AI about the recommendations provided and how they address the user\'s request.'),
});
export type RecommendFacilityOutput = z.infer<typeof RecommendFacilityOutputSchema>;

/**
 * Genkit tool to simulate finding available facilities based on criteria.
 */
const findAvailableFacilities = ai.defineTool(
  {
    name: 'findAvailableFacilities',
    description: 'Finds available facilities based on specified criteria like minimum capacity, required equipment, and purpose keywords. Returns a list of matching facilities with their details and some mock availability.',
    inputSchema: z.object({
      minCapacity: z.number().optional().describe('Minimum required capacity for the facility.'),
      requiredEquipment: z.array(z.string()).optional().describe('List of essential equipment (e.g., "projector", "whiteboard", "computers").'),
      purposeKeywords: z.array(z.string()).optional().describe('Keywords describing the purpose or type of facility needed (e.g., "seminar", "meeting", "study").'),
    }),
    outputSchema: z.array(FacilityDetailsSchema),
  },
  async (input) => {
    let filteredFacilities = MOCK_FACILITIES;

    if (input.minCapacity) {
      filteredFacilities = filteredFacilities.filter(
        (f) => f.capacity >= input.minCapacity!
      );
    }
    if (input.requiredEquipment && input.requiredEquipment.length > 0) {
      filteredFacilities = filteredFacilities.filter((f) =>
        input.requiredEquipment!.every((req) =>
          f.equipment.some((eq) => eq.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }
    if (input.purposeKeywords && input.purposeKeywords.length > 0) {
      filteredFacilities = filteredFacilities.filter((f) =>
        input.purposeKeywords!.some((keyword) =>
          f.description.toLowerCase().includes(keyword.toLowerCase()) || f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    // Limit to a reasonable number of recommendations for practical purposes
    return filteredFacilities.slice(0, 3);
  }
);

/**
 * Genkit prompt for recommending facilities.
 */
const recommendFacilityPrompt = ai.definePrompt({
  name: 'recommendFacilityPrompt',
  input: { schema: RecommendFacilityInputSchema },
  output: { schema: RecommendFacilityOutputSchema },
  tools: [findAvailableFacilities],
  prompt: `You are an intelligent facility reservation assistant for WhereTo, the campus resource management system for Gordon College.
Your primary goal is to help users find the most suitable facilities based on their natural language requests.

Your task is to:
1. Carefully analyze the user's request to identify key requirements such as the minimum capacity, specific equipment needed (e.g., projector, whiteboard, computers, sound system), and the purpose or type of event (e.g., seminar, meeting, study session, lecture).
2. Using the extracted requirements, call the \`findAvailableFacilities\` tool to search for facilities that best match these criteria. It is crucial to call the tool first to get the available facilities.
3. Based on the facilities returned by the tool, select the most appropriate ones.
4. For each recommended facility, provide its ID, name, capacity, key equipment that matches the request, example available time slots, and a clear, concise explanation of why it is suitable for the user's specific request.
5. Finally, provide an overall AI explanation summarizing your recommendations and how they address the user's original request.

User Request: {{{userRequest}}}
`,
});

/**
 * Genkit flow for recommending facilities.
 */
const recommendFacilityFlow = ai.defineFlow(
  {
    name: 'recommendFacilityFlow',
    inputSchema: RecommendFacilityInputSchema,
    outputSchema: RecommendFacilityOutputSchema,
  },
  async (input) => {
    const { output } = await recommendFacilityPrompt(input);
    if (!output) {
      throw new Error('Failed to get facility recommendations from the AI.');
    }
    return output;
  }
);

/**
 * Recommends facilities based on a user's natural language request.
 *
 * @param input - The user's request describing facility requirements.
 * @returns A promise that resolves to a list of recommended facilities and an AI explanation.
 */
export async function recommendFacility(input: RecommendFacilityInput): Promise<RecommendFacilityOutput> {
  return recommendFacilityFlow(input);
}
