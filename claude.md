# Claude Code Instructions

This is an interactive Polymarket prediction market agent built with the Claude Agent SDK.

## Project Overview

- **Purpose**: Interactive chat agent for exploring Polymarket prediction markets
- **Stack**: TypeScript, Node.js, Claude Agent SDK
- **MCP Server**: Uses polymarket-mcp for Polymarket API access

## Key Files

- `src/agent.ts` - Main agent implementation with interactive chat loop
- `tsconfig.json` - TypeScript configuration (ES2022, NodeNext modules)
- `package.json` - Dependencies and npm scripts

## Development Commands

```bash
npm run build   # Compile TypeScript to dist/
npm start       # Run compiled agent
npm run dev     # Build + run
```

## Agent Architecture

The agent runs in interactive mode:
1. Displays welcome message and waits for user input
2. Processes each message using `query()` from the Claude Agent SDK
3. Continues until user types "quit" or "exit"

Key functions:
- `main()` - Chat loop that handles user input and exit commands
- `processUserMessage()` - Sends user message to Claude with system prompt
- `handleAskUserQuestion()` - Handles interactive questions from the agent

## Agent Configuration

The agent uses:
- `query()` from `@anthropic-ai/claude-agent-sdk`
- `permissionMode: "default"` for tool approval
- MCP server configured via stdio transport pointing to polymarket-mcp
- Tools: Read, Write, Glob, Grep, AskUserQuestion

## MCP Server

The polymarket-mcp server provides tools for:
- Searching markets (`search_markets`)
- Getting market details (`get_markets`, `get_market_by_id`)
- Price data (`get_price`, `get_prices`)
- Event data (`get_events`, `get_event_by_id`)

Server location: `/Volumes/Lexar/repos/polymarket-mcp/dist/index.js`
Repo location: https://github.com/arekgotfryd/polymarket-mcp

## Modifying the Agent

To change the agent's behavior or capabilities, edit `SYSTEM_PROMPT` in `src/agent.ts`.

To change the model, update the `model` option in the `query()` call within `processUserMessage()`.
