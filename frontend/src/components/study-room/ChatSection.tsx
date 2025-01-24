import { MessageSquare, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  id: number;
  from: string;
  content: string;
  timestamp: string;
  senderName?: string;
}

interface ConnectedUser {
  email: string;
  fullName: string;
  online: boolean;
}

interface ChatSectionProps {
  messages: Message[];
  message: string;
  userEmail: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
  connectedUsers: ConnectedUser[];
}

export const ChatSection = ({
  messages,
  message,
  userEmail,
  setMessage,
  sendMessage,
  connectedUsers
}: ChatSectionProps) => {
  const getSenderName = (email: string) => {
    const user = connectedUsers.find(u => u.email === email);
    return user?.fullName || email;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-4">
          {messages.map((msg: Message) => (
            <div
              key={`${msg.id}-${msg.timestamp}`}
              className={`flex ${
                msg.from === userEmail ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.from === userEmail
                    ? "bg-primary text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-xs font-semibold mb-1">
                  {msg.from === userEmail ? "You" : getSenderName(msg.from)}
                </p>
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-6">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} className="flex items-center gap-1 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100">
            <MessageSquare className="h-4 w-4" />
            Send
          </Button>
          <Button className="flex items-center gap-1 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </Card>
  );
};
