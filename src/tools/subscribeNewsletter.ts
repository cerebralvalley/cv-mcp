import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { API_BASE_URL } from '../constants';

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
        const response = await fetch(
          `${API_BASE_URL}/public/beehiiv/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            content: [
              {
                type: 'text' as const,
                text: data.detail || 'Subscription failed',
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text:
                data.detail ||
                `Subscribed ${email} to Cerebral Valley newsletter`,
            },
          ],
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
