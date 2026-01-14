# Polymarket Agent

An interactive AI agent built with the [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) that lets you explore Polymarket prediction markets through a chat interface.

## Overview

This agent uses the [polymarket-mcp](https://github.com/arekgotfryd/polymarket-mcp) server to interact with Polymarket. You can ask questions about markets, search for specific predictions, get price data, and save results to files.

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

## Interactive Mode

The agent runs in interactive chat mode:

```
Polymarket Agent - Interactive Mode
====================================
Ask me anything about Polymarket prediction markets.
Type 'quit' or 'exit' to end the session.

You: What are the current box office prediction markets?
Assistant: [responds with market data]

You: Save those to a file called markets.json
Assistant: [saves the data]

You: quit
Goodbye!
```

### Example Queries

- "Search for markets about the 2024 election"
- "What's the current price for [market name]?"
- "Get details about market ID xyz"
- "Find all active box office markets and save them to a JSON file"

## Configuration

The agent is configured in `src/agent.ts`:

- **Model**: `claude-opus-4-5-20251101`
- **MCP Server**: polymarket-mcp (stdio transport)
- **Tools**: Read, Write, Glob, Grep, AskUserQuestion

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
