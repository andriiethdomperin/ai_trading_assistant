// app/api/chat/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearch } from "@langchain/tavily";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const openaiApiKey = process.env.OPENAI_API_KEY;
const tavilyApiKey = process.env.TAVILY_API_KEY;

export async function POST(request: Request) {
  const { messages } = await request.json();
  const message = messages[messages.length - 1].content;

  // Initialize the language model
  const model = new ChatOpenAI({
    openAIApiKey: openaiApiKey,
    modelName: "gpt-4o-mini",
    temperature: 0.3,
  });

  // Initialize the search tool
  const searchTool = new TavilySearch({
    tavilyApiKey: tavilyApiKey,
    maxResults: 1,
  });

  let res = await searchTool.invoke({
    query: "what is current bitcoin marketcap",
  });
  console.log("res: ", res);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an expert AI trading assistant with access to real-time market data and web search capabilities. Your role is to:

1. Provide accurate, up-to-date market information and analysis
2. Search for current stock prices, market trends, and financial news when needed
3. Give informed trading insights based on real-time data
4. Always mention when you're using current data vs. general knowledge
5. Be helpful but remind users to do their own research before making trading decisions

When users ask about current market data, stock prices, or recent news, use the search tool to get the latest information.

IMPORTANT: Always verify information with current sources and be transparent about data sources.

After using a tool, always return the result to the user in a complete sentence.`,
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  // Create the agent
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools: [searchTool],
    prompt,
  });

  // Create the agent executor
  const agentExecutor = AgentExecutor.fromAgentAndTools({
    agent,
    tools: [searchTool],
    // verbose: true,
  });

  // Execute the agent
  const result = await agentExecutor.invoke({
    input: message,
  });

  const reply = result.output || "Sorry, I couldn't get a response.";

  return NextResponse.json({ reply });
}
