"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send, Volume2, VolumeX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  description: string;
  speaking_url: string;
  created_at: string;
  updated_at: string;
  voice_id: string;
}

interface VideoCache {
  [key: string]: HTMLVideoElement;
}

export function Chat() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentTextRef = useRef<string>("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoSource, setVideoSource] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const supabase = createClient();
  const videoCacheRef = useRef<VideoCache>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        videoRef.current.currentTime = 5;
      } else {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isSpeaking]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      if (isSpeaking && videoRef.current.currentTime >= 17) {
        videoRef.current.currentTime = 5;
      } else if (!isSpeaking && videoRef.current.currentTime >= 3) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const preloadVideo = (url: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      // Check if video is already in cache
      if (videoCacheRef.current[url]) {
        resolve(videoCacheRef.current[url]);
        return;
      }

      const video = document.createElement("video");
      video.preload = "auto";
      video.src = url;
      video.muted = true; // Mute during preload
      video.playsInline = true;

      video.onloadeddata = () => {
        videoCacheRef.current[url] = video;
        resolve(video);
      };

      video.load();
    });
  };

  const changeVideoSource = async (url: string) => {
    if (!url) return;
    setIsVideoLoading(true);
    try {
      setVideoSource(url);
    } catch (error) {
      console.error("Error changing video source:", error);
      toast.error("Failed to load video");
    }
  };

  // Add preload function
  const preloadAllVideos = async (characters: Character[]) => {
    const allUrls = characters.map((character) => character.speaking_url);
    await Promise.all(allUrls.map((url) => preloadVideo(url)));
  };

  // Add video loading handlers
  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsVideoLoading(true);
      try {
        const { data, error } = await supabase
          .from("avatars")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform the data
          const transformedData = data.map((avatar) => ({
            ...avatar,
          }));

          // Preload all videos
          preloadAllVideos(transformedData);

          setCharacters(transformedData);
          setSelectedCharacter(transformedData[0]);
          setVideoSource(transformedData[0].speaking_url);
          setIsVideoLoading(false);
          // Initialize messages with the first character's description as system prompt
          setMessages([
            {
              id: Date.now().toString(),
              content: transformedData[0].description,
              role: "system",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        toast.error("Failed to load avatars");
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        const scrollElement = scrollRef.current;
        const scrollContainer = scrollElement.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };

    scrollToBottom();
    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isProcessing]);

  const toggleSpeaking = async () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleChatInteraction = async (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            }))
            .concat([{ role: "user", content: message }]),
        }),
      });

      const chatData = await chatResponse.json();

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: chatData.reply,
        role: "assistant",
        timestamp: new Date(),
      };

      const text = chatData.reply;
      currentTextRef.current = text;

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice_id: selectedCharacter?.voice_id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate speech");
        }

        setMessages((prev) => [...prev, responseMessage]);

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        } else {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.play();
        }

        setIsSpeaking(true);

        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          toast.error("Error playing audio");
        };
      } catch (error) {
        console.error("Error generating speech:", error);
        toast.error("Failed to generate speech");
      }
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await handleChatInteraction(inputMessage);
    setInputMessage("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setIsRecording(true);
      mediaRecorder.start();
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (audioBlob.size === 0) {
          toast.error("No audio recorded");
          return;
        }

        try {
          const response = await fetch("/api/stt", {
            method: "POST",
            headers: {
              "Content-Type": "audio/webm",
            },
            body: audioBlob,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to transcribe audio");
          }

          const data = await response.json();
          setInputMessage(data.text);
          // Automatically send the transcribed text
          await handleChatInteraction(data.text);
        } catch (error) {
          console.error("Error transcribing audio:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to transcribe audio"
          );
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());

        // Reset recording duration
        setRecordingDuration(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      // Start recording duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      // Clear recording duration timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCharacterChange = async (characterId: string) => {
    const newCharacter = characters.find((c) => c.id === characterId);
    if (newCharacter) {
      setSelectedCharacter(newCharacter);
      await changeVideoSource(newCharacter.speaking_url);
      setMessages([
        {
          id: Date.now().toString(),
          content: newCharacter.description,
          role: "system",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="text-sm font-medium mb-2">Interactive Avatar</div>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={selectedCharacter?.id || ""}
          onValueChange={handleCharacterChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a character" />
          </SelectTrigger>
          <SelectContent>
            {characters.map((character) => (
              <SelectItem key={character.id} value={character.id}>
                {character.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-background rounded-lg flex items-center justify-center overflow-hidden relative">
        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* {videoSource && (
            <video
              ref={videoRef}
              src={videoSource}
              poster={videoSource}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={handleVideoLoad}
              onTimeUpdate={handleVideoTimeUpdate}
              className={cn(isVideoLoading && "opacity-0")}
              controls={false}
            />
          )} */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSpeaking}
            disabled={!currentTextRef.current}
            className="bg-background/80 hover:bg-background/90"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mt-4 flex flex-col bg-background rounded-lg h-full overflow-hidden">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div
            className="space-y-4"
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  isRecording ? stopRecording() : startRecording()
                }
                className={cn(
                  "relative",
                  isRecording && "bg-destructive text-destructive-foreground"
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Mic className="h-4 w-4" />
                        {isRecording && (
                          <>
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-destructive">
                              {formatDuration(recordingDuration)}
                            </span>
                            <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                          </>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRecording
                        ? "Click to stop recording"
                        : "Click to start recording"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
