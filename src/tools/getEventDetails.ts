import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchEventById } from '../api.js';

export function registerGetEventDetails(server: McpServer) {
  server.registerTool(
    'get_event_details',
    {
      description: 'Get full details for a single event by ID',
      inputSchema: z.object({
        id: z.string().describe('Event ID returned from search_events'),
      }),
    },
    async ({ id }) => {
      try {
        const ev = await fetchEventById(id);

        if (!ev) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Event with id '${id}' not found.`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(ev, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching event: ${
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

