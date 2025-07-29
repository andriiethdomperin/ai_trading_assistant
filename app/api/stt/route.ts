import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the audio data directly from the request body
    const arrayBuffer = await req.arrayBuffer();

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    // Create a Blob from the array buffer
    const audioBlob = new Blob([arrayBuffer], { type: "audio/webm" });

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    // Make the request to OpenAI's API directly
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to transcribe audio");
    }

    const transcription = await response.json();
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Error in STT API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to transcribe audio";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
