import { Chat } from "./chat";

export default function MainChat() {
  return (
    <div className="mb-6 container h-[calc(100vh-97px)]">
      <h2 className="text-xl font-bold mb-4">AI trading assistant</h2>
      <div className="rounded-lg border text-card-foreground shadow-sm h-[calc(100%-72px)]">
        <div className="border-r bg-muted p-4 flex flex-col h-full">
          <Chat />
        </div>
      </div>
    </div>
  );
}
