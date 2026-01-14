# Polymarket Agent

A simple AI agent built with the [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) that queries Polymarket for movie box office prediction markets.

## Overview

This agent uses the [polymarket-mcp](https://github.com/arekgotfryd/polymarket-mcp) server to fetch active "Weekend Box Office" and "Opening Weekend Box Office" markets from Polymarket and saves the data to a JSON file.

## Prerequisites

- Node.js >= 18.0.0
- [polymarket-mcp](https://github.com/arekgotfryd/polymarket-mcp) server built and available at `/Volumes/Lexar/repos/polymarket-mcp/dist/index.js`
- Anthropic API key configured

## Installation

```bash
npm install
```

## Usage

Build and run the agent:

```bash
npm run build   # Compile TypeScript
npm start       # Run the agent
```

Or use the dev script:

```bash
npm run dev     # Build and run in one command
```

## Output

The agent will:
1. Search Polymarket for active box office prediction markets
2. Collect market details (title, description, outcomes, prices, volume)
3. Save the results to `opening_weekend.json`

## Configuration

The agent is configured in `src/agent.ts`:

- **Model**: `claude-opus-4-5-20251101`
- **MCP Server**: polymarket-mcp (stdio transport)
- **Output file**: `opening_weekend.json`

## Project Structure

```
polymarket-agent/
├── src/
│   └── agent.ts       # Agent source code
├── dist/              # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
