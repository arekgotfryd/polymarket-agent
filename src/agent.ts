import { PermissionResult, query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";

const SYSTEM_PROMPT = `You are a helpful Polymarket assistant. You have access to Polymarket MCP tools to:
- Search for markets (search_markets)
- Get market details (get_markets, get_market_by_id)
- Get price data (get_price, get_prices)
- Get event data (get_events, get_event_by_id)

Help the user explore prediction markets, find information about specific markets, and save data when requested.`;

// Create a single readline interface for the session
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to prompt user for input in the terminal
function prompt(question: string): Promise<string> {
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      resolve(answer);
    })
  );
}

// Parse user input as option number(s) or free text
function parseResponse(response: string, options: any[]): string {
  const indices = response.split(",").map((s) => parseInt(s.trim()) - 1);
  const labels = indices
    .filter((i) => !isNaN(i) && i >= 0 && i < options.length)
    .map((i) => options[i].label);
  return labels.length > 0 ? labels.join(", ") : response;
}
// Display Claude's questions and collect user answers
async function handleAskUserQuestion(input: any): Promise<PermissionResult> {
  const answers: Record<string, string> = {};

  for (const q of input.questions) {
    console.log(`\n${q.header}: ${q.question}`);

    const options = q.options;
    options.forEach((opt: any, i: number) => {
      console.log(`  ${i + 1}. ${opt.label} - ${opt.description}`);
    });
    if (q.multiSelect) {
      console.log(
        "  (Enter numbers separated by commas, or type your own answer)"
      );
    } else {
      console.log("  (Enter a number, or type your own answer)");
    }

    const response = (await prompt("Your choice: ")).trim();
    answers[q.question] = parseResponse(response, options);
  }

  // Return the answers to Claude (must include original questions)
  return {
    behavior: "allow",
    updatedInput: { questions: input.questions, answers },
  };
}

async function processUserMessage(userMessage: string): Promise<void> {
  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${userMessage}`;

  const result = query({
    prompt: fullPrompt,
    options: {
      model: "claude-opus-4-5-20251101",
      permissionMode: "default",
      mcpServers: {
        polymarket: {
          type: "stdio",
          command: "node",
          args: ["/Volumes/Lexar/repos/polymarket-mcp/dist/index.js"],
        },
      },
      tools: ["Read", "Write", "Glob", "Grep", "AskUserQuestion"],
      canUseTool: async (toolName, input) => {
        // Route AskUserQuestion to our question handler
        if (toolName === "AskUserQuestion") {
          return handleAskUserQuestion(input);
        }
        // Auto-approve other tools for this example
        return { behavior: "allow", updatedInput: input };
      },
    },
  });

  for await (const message of result) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") {
          console.log(block.text);
        } else if (block.type === "tool_use") {
          console.log(`\n[Using tool: ${block.name}]`);
        }
      }
    } else if (message.type === "result") {
      console.log("\n--- Response complete ---\n");
    }
  }
}

async function main(): Promise<void> {
  console.log("Polymarket Agent - Interactive Mode");
  console.log("====================================");
  console.log("Ask me anything about Polymarket prediction markets.");
  console.log("Type 'quit' or 'exit' to end the session.\n");

  while (true) {
    const userInput = await prompt("You: ");
    const trimmedInput = userInput.trim().toLowerCase();

    if (trimmedInput === "quit" || trimmedInput === "exit") {
      console.log("\nGoodbye!");
      rl.close();
      break;
    }

    if (userInput.trim() === "") {
      continue;
    }

    console.log("\nAssistant:");
    await processUserMessage(userInput.trim());
  }
}

main().catch((err) => {
  console.error(err);
  rl.close();
});
