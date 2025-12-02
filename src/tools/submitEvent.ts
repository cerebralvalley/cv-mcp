import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CITY_FILTER_VALUES, EVENT_TYPE_VALUES } from '../constants.js';

export function registerSubmitEvent(server: McpServer) {
  server.registerTool(
    'submit_event',
    {
      description:
        'Submit a new event to be listed on Cerebral Valley (pending review)',
      inputSchema: z.object({
        name: z.string().describe('Name of the event'),
        description: z.string().optional(),
        descriptionSummary: z.string().optional().describe('Short summary'),
        location: z.string(),
        venue: z.string().optional(),
        cityFilter: z.enum(CITY_FILTER_VALUES).optional(),
        type: z
          .enum(EVENT_TYPE_VALUES)
          .optional()
          .describe('Set to HACKATHON if this is a hackathon'),
        startDateTime: z.string().describe('ISO 8601 start time'),
        endDateTime: z.string().describe('ISO 8601 end time'),
        timeZone: z
          .string()
          .optional()
          .describe('IANA timezone, e.g. America/Los_Angeles'),
        url: z
          .string()
          .url()
          .optional()
          .describe('External landing page, if any'),
      }),
    },
    async (input) => {
      // TODO: Wire up to actual submission API endpoint
      const id =
        input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now().toString(36);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Event "${input.name}" submitted for review with id: ${id}. `,
          },
        ],
      };
    }
  );
}
