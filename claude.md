# Claude Code Instructions

This is a Polymarket prediction market agent built with the Claude Agent SDK.

## Project Overview

- **Purpose**: Query Polymarket for movie box office prediction markets and save results to JSON
- **Stack**: TypeScript, Node.js, Claude Agent SDK
- **MCP Server**: Uses polymarket-mcp for Polymarket API access

## Key Files

- `src/agent.ts` - Main agent implementation
- `tsconfig.json` - TypeScript configuration (ES2022, NodeNext modules)
- `package.json` - Dependencies and npm scripts

## Development Commands

```bash
npm run build   # Compile TypeScript to dist/
npm start       # Run compiled agent
npm run dev     # Build + run
```

## Agent Configuration

The agent uses:
- `query()` from `@anthropic-ai/claude-agent-sdk`
- `permissionMode: "bypassPermissions"` for autonomous operation
- MCP server configured via stdio transport pointing to polymarket-mcp

## MCP Server

The polymarket-mcp server provides tools for:
- Searching markets (`search_markets`)
- Getting market details (`get_markets`, `get_market_by_id`)
- Price data (`get_price`, `get_prices`)
- Event data (`get_events`, `get_event_by_id`)

Server location: `/Volumes/Lexar/repos/polymarket-mcp/dist/index.js`
Repo location: https://github.com/arekgotfryd/polymarket-mcp 

## Modifying the Agent

To change what markets the agent searches for, edit the `PROMPT` constant in `src/agent.ts`.

To change the model, update the `model` option in the `query()` call.
