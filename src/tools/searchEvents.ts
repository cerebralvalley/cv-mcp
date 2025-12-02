import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchEvents } from '../api.js';
import {
  CITY_FILTER_VALUES,
  EVENT_TYPE_VALUES,
  DEFAULT_MAX_RESULTS,
} from '../constants.js';

// Utility: case-insensitive includes
const contains = (haystack: string, needle?: string | null) =>
  !needle ? true : haystack.toLowerCase().includes(needle.toLowerCase());

export function registerSearchEvents(server: McpServer) {
  server.registerTool(
    'search_events',
    {
      description:
        'Search Cerebral Valley events by location, type, and time window',
      inputSchema: z.object({
        q: z
          .string()
          .optional()
          .describe('Free-text query on name/description'),
        cityFilter: z
          .enum(CITY_FILTER_VALUES)
          .optional()
          .describe(
            'City filter (defaults to SF & Bay Area, Other includes all other locations)'
          ),
        eventType: z
          .enum(EVENT_TYPE_VALUES)
          .optional()
          .describe('Filter for hackathons only (omit for all events)'),
        featured: z
          .boolean()
          .optional()
          .describe('Filter for featured events only'),
        startDate: z
          .string()
          .optional()
          .describe('Earliest event start date, YYYY-MM-DD (defaults to now)'),
        endDate: z
          .string()
          .optional()
          .describe('Latest event start date, YYYY-MM-DD'),
        maxResults: z
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .default(DEFAULT_MAX_RESULTS)
          .describe('Max number of events to return'),
      }),
    },
    async ({
      q,
      cityFilter,
      eventType,
      featured,
      startDate,
      endDate,
      maxResults,
    }) => {
      try {
        const startDateTime = startDate
          ? new Date(startDate).toISOString()
          : new Date().toISOString();
        const endDateTime = endDate
          ? new Date(endDate).toISOString()
          : undefined;

        const events = await fetchEvents({
          startDateTime,
          endDateTime,
          cityFilter,
          type: eventType,
          featured,
        });

        // Apply free-text filter client-side
        let filtered = events;
        if (q) {
          filtered = events.filter(
            (ev) =>
              contains(ev.name, q) ||
              contains(ev.description ?? '', q) ||
              contains(ev.location, q)
          );
        }

        filtered = filtered.slice(0, maxResults ?? DEFAULT_MAX_RESULTS);

        return {
          content: [
            {
              type: 'text' as const,
              text:
                filtered.length === 0
                  ? 'No matching events found.'
                  : JSON.stringify(filtered, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching events: ${
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
