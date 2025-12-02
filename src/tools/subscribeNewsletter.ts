import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { subscribeToNewsletter } from '../api.js';

export function registerSubscribeNewsletter(server: McpServer) {
  server.registerTool(
    'subscribe_to_newsletter',
    {
      description:
        'Subscribe an email to the Cerebral Valley events/newsletter feed',
      inputSchema: z.object({
        email: z.email().describe('Subscriber email address'),
      }),
    },
    async ({ email }) => {
      try {
        const result = await subscribeToNewsletter(email);

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
              text: `Error subscribing: ${
                error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
