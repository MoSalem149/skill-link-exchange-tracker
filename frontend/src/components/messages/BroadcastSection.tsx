import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BroadcastProps {
  isAdmin: boolean;
  broadcasts: any[];
  setBroadcasts: (broadcasts: any[]) => void;
  userEmail: string | null;
}

export const BroadcastSection = ({ isAdmin, broadcasts, setBroadcasts, userEmail }: BroadcastProps) => {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const { toast } = useToast();

  const sendBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const newBroadcast = {
      id: Date.now(),
      message: broadcastMessage,
      from: userEmail,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedBroadcasts = [...broadcasts, newBroadcast];
    localStorage.setItem("broadcasts", JSON.stringify(updatedBroadcasts));
    setBroadcasts(updatedBroadcasts);
    setBroadcastMessage("");

    toast({
      title: "Success",
      description: "Broadcast message sent successfully",
    });
  };

  const markAsRead = (messageId: number) => {
    const updatedBroadcasts = broadcasts.map(broadcast => 
      broadcast.id === messageId ? { ...broadcast, read: true } : broadcast
    );
    localStorage.setItem("broadcasts", JSON.stringify(updatedBroadcasts));
    setBroadcasts(updatedBroadcasts);
  };

  const deleteMessage = (messageId: number) => {
    const updatedBroadcasts = broadcasts.filter(broadcast => broadcast.id !== messageId);
    localStorage.setItem("broadcasts", JSON.stringify(updatedBroadcasts));
    setBroadcasts(updatedBroadcasts);
    toast({
      title: "Success",
      description: "Message deleted successfully",
    });
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Send Broadcast Message</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Type your broadcast message..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendBroadcast} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Broadcasts</h2>
        {broadcasts.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No broadcasts available</p>
          </Card>
        ) : (
          broadcasts.map((broadcast) => (
            <Card key={broadcast.id} className="p-4 relative">
              <div className="space-y-2">
                {!broadcast.read && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    New
                  </Badge>
                )}
                <p className="text-gray-600">{broadcast.message}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>From: {broadcast.from}</span>
                  <span>{new Date(broadcast.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  {!broadcast.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(broadcast.id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteMessage(broadcast.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )).reverse()
        )}
      </div>
    </div>
  );
};