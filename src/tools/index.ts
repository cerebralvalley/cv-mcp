import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSearchEvents } from './searchEvents.js';
import { registerSubmitEvent } from './submitEvent.js';
import { registerSubscribeNewsletter } from './subscribeNewsletter.js';

export function registerAllTools(server: McpServer) {
  registerSearchEvents(server);
  registerSubmitEvent(server);
  registerSubscribeNewsletter(server);
}
