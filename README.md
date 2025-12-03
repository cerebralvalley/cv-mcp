# Cerebral Valley MCP Server

Cerebral Valley provides tools for discovering and submitting AI community events, hackathons, and meetups.

## Features

- **search_events** — Search events by city, type, date range, and free-text query
- **submit_event** — Submit a new event for review
- **subscribe_to_newsletter** — Subscribe an email to the CV newsletter

## Quick Start (Hosted)

The easiest way to use this MCP server is via [Smithery](https://smithery.ai/server/@cerebralvalley/cv-mcp).

### With Claude Desktop

```bash
npx -y @smithery/cli install @cerebralvalley/cv-mcp --client claude
```

### With Cursor

```bash
npx -y @smithery/cli install @cerebralvalley/cv-mcp --client cursor
```

Or manually add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cerebralvalley": {
      "url": "https://server.smithery.ai/@cerebralvalley/cv-mcp/mcp"
    }
  }
}
```

## Self-Hosted Installation

If you want to run the server locally:

### Installation

```bash
bun install
```

### Development

```bash
bun run dev        # stdio transport (for local MCP clients)
bun run dev:http   # HTTP transport (for testing Smithery deployment)
```

### With Cursor (Local)

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cv-events": {
      "command": "bun",
      "args": ["run", "/path/to/cerebralvalley-events-mcp/src/server.ts"]
    }
  }
}
```

Then restart Cursor to load the MCP server.

## Project Structure

```
src/
├── server.ts        # MCP server entry point (stdio transport)
├── http-server.ts   # MCP server for Smithery (HTTP transport)
├── api.ts           # API fetch functions
├── types.ts         # TypeScript types
├── constants.ts     # Shared constants (cities, event types, etc.)
└── tools/
    ├── index.ts               # Tool registration
    ├── searchEvents.ts        # Search events tool
    ├── submitEvent.ts         # Submit event tool
    └── subscribeNewsletter.ts # Newsletter subscription tool
```

## API

The server connects to the Cerebral Valley public API:

- Base URL: `https://api.cerebralvalley.ai/v1`

### Supported City Filters

- SF & Bay Area (default)
- New York City
- Boston
- Seattle
- London
- Remote
- Other

### Event Types

- `HACKATHON` — Filter for hackathons only
- Omit for all event types

## Tech Stack

- [Bun](https://bun.sh) — JavaScript runtime
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) — Model Context Protocol
- [Zod](https://zod.dev) — Schema validation
