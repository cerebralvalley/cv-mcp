import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAllTools } from './tools/index.js';

const server = new McpServer(
  {
    name: 'cerebralvalley',
    version: '0.1.0',
  },
  {
    capabilities: {
      logging: {},
    },
  }
);

registerAllTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
