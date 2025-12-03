import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from 'node:http';
import { registerAllTools } from './tools/index.js';
import { randomUUID } from 'node:crypto';

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

// Create a map to store transports by session ID
const transports = new Map<string, StreamableHTTPServerTransport>();

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Handle MCP endpoint
  if (url.pathname === '/mcp') {
    // Check for existing session
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      // Reuse existing transport
      transport = transports.get(sessionId)!;
    } else if (!sessionId && req.method === 'POST') {
      // New session - create transport
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          transports.set(id, transport);
        },
        onsessionclosed: (id) => {
          transports.delete(id);
        },
      });

      // Connect to MCP server
      await server.connect(transport);
    } else if (!sessionId) {
      // No session ID for non-POST request
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing session ID' }));
      return;
    } else {
      // Invalid session ID
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Session not found' }));
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res);
    return;
  }

  // Health check endpoint
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = parseInt(process.env.PORT || '8000', 10);

httpServer.listen(PORT, () => {
  console.log(`Cerebral Valley MCP server running on port ${PORT}`);
});
