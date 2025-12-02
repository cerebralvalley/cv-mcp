import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { submitEvent } from '../api';

// Convert any ISO 8601 datetime to UTC format with Z suffix
function toUTCDateTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid datetime: ${dateTimeStr}`);
  }
  return date.toISOString();
}

export function registerSubmitEvent(server: McpServer) {
  server.registerTool(
    'submit_event',
    {
      description:
        'Submit a new event to be listed on Cerebral Valley (pending review). Users can optionally request to be featured on CV or request info about the CV events platform.',
      inputSchema: z.object({
        submitterEmail: z.email().describe('Email of the person submitting'),
        name: z.string().describe('Name of the event'),
        startDateTime: z.string().describe('ISO 8601 start time'),
        endDateTime: z.string().describe('ISO 8601 end time'),
        location: z.string().describe('Event location'),
        url: z.url().describe('Event landing page URL'),
        featureRequested: z
          .boolean()
          .default(false)
          .describe('Request to be featured on CV'),
        cvEventsPlatformInfoRequested: z
          .boolean()
          .default(false)
          .describe('Request info about CV events platform'),
      }),
    },
    async (input) => {
      try {
        const result = await submitEvent({
          submitterEmail: input.submitterEmail,
          name: input.name,
          startDateTime: toUTCDateTime(input.startDateTime),
          endDateTime: toUTCDateTime(input.endDateTime),
          location: input.location,
          url: input.url,
          featureRequested: input.featureRequested,
          cvEventsPlatformInfoRequested: input.cvEventsPlatformInfoRequested,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: result.message,
            },
          ],
          isError: !result.success,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error submitting event: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
