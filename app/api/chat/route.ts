// app/api/chat/route.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { messages } = await request.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-search-preview",
    messages,
  });

  return NextResponse.json({ reply: completion.choices[0].message.content });
}
