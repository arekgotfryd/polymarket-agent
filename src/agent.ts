import { PermissionResult, query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
const PROMPT = `Bring all the active markets data which have either "Weekend Box Office" or "Opening Weekend Box Office" in their market name and save info about them in a .json file called opening_weekend.json in the current directory.

Use the polymarket MCP tools available to:
1. Search for markets related to "movie opening weekend" or "box office"
2. Get details about each active market found
3. Collect relevant information like market title, description, outcomes, prices, and volume
4. Save all the collected data to opening_weekend.json`;

// Helper to prompt user for input in the terminal
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
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

async function main(): Promise<void> {
  console.log("Starting Polymarket Movie Markets Agent...\n");

  const result = query({
    prompt: PROMPT,
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
      tools: ["Read", "Glob", "Grep", "AskUserQuestion"],
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
      console.log("\n--- Agent completed ---");
      console.log("Exit reason:", message.subtype);
    }
  }
}

main().catch(console.error);
