import { MessageSquare, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChatSectionProps {
  messages: any[];
  message: string;
  userEmail: string | null;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

export const ChatSection = ({
  messages,
  message,
  userEmail,
  setMessage,
  sendMessage,
}: ChatSectionProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-4">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
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
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </Card>
  );
};