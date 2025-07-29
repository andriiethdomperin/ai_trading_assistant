import { NextResponse } from "next/server";
import { CartesiaClient } from "@cartesia/cartesia-js";

export async function POST(req: Request) {
  try {
    const { text, voice_id } = await req.json();
    const client = new CartesiaClient({
      apiKey: process.env.CARTESIA_API_KEY!,
    });

    const response = await client.tts.bytes({
      modelId: "sonic-2",
      transcript: text,
      voice: {
        mode: "id",
        id: voice_id,
      },
      language: "en",
      outputFormat: {
        container: "mp3",
        sampleRate: 44100,
        bitRate: 128000,
      },
    });

    const audioBlob = new Blob([response], { type: "audio/mpeg" });
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
