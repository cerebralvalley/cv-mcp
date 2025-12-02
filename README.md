# Cerebral Valley Events MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to Cerebral Valley events data.

## Features

- **search_events** — Search events by city, type, date range, and free-text query
- **submit_event** — Submit a new event for review
- **subscribe_to_newsletter** — Subscribe an email to the CV newsletter

## Installation

```bash
bun install
```

## Usage

### Development

```bash
bun run dev
```

### With Cursor

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
├── server.ts       # MCP server entry point
├── api.ts          # API fetch functions
├── types.ts        # TypeScript types
├── constants.ts    # Shared constants (cities, event types, etc.)
└── tools/
    ├── index.ts              # Tool registration
    ├── searchEvents.ts       # Search events tool
    ├── submitEvent.ts        # Submit event tool
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
