import { query } from "@anthropic-ai/claude-agent-sdk";

const PROMPT = `Bring all the active markets data which have either "Weekend Box Office" or "Opening Weekend Box Office" in their market name and save info about them in a .json file called opening_weekend.json in the current directory.

Use the polymarket MCP tools available to:
1. Search for markets related to "movie opening weekend" or "box office"
2. Get details about each active market found
3. Collect relevant information like market title, description, outcomes, prices, and volume
4. Save all the collected data to opening_weekend.json`;

async function main(): Promise<void> {
  console.log("Starting Polymarket Movie Markets Agent...\n");

  const result = query({
    prompt: PROMPT,
    options: {
      model: "claude-opus-4-5-20251101",
      permissionMode: "bypassPermissions",
      mcpServers: {
        polymarket: {
          type: "stdio",
          command: "node",
          args: ["/Volumes/Lexar/repos/polymarket-mcp/dist/index.js"],
        },
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
