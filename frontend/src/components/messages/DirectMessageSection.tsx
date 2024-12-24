import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, UserPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface DirectMessageProps {
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  directMessage: string;
  setDirectMessage: (message: string) => void;
  directMessages: any[];
  setDirectMessages: (messages: any[]) => void;
  users: any[];
  userEmail: string | null;
}

export const DirectMessageSection = ({
  selectedUser,
  setSelectedUser,
  directMessage,
  setDirectMessage,
  directMessages,
  setDirectMessages,
  users,
  userEmail,
}: DirectMessageProps) => {
  const { toast } = useToast();

  const sendDirectMessage = () => {
    if (!directMessage.trim() || !selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user and enter a message",
        variant: "destructive",
      });
      return;
    }

    const newMessage = {
      id: Date.now(),
      message: directMessage,
      from: userEmail,
      to: selectedUser,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...directMessages, newMessage];
    localStorage.setItem("directMessages", JSON.stringify(updatedMessages));
    setDirectMessages(updatedMessages);
    setDirectMessage("");

    toast({
      title: "Success",
      description: "Message sent successfully",
    });
  };

  const getMessagesWithUser = (userEmail: string) => {
    return directMessages.filter(
      (msg: any) =>
        (msg.from === userEmail && msg.to === selectedUser) ||
        (msg.from === selectedUser && msg.to === userEmail)
    );
  };

  const markAsRead = (messageId: number) => {
    const updatedMessages = directMessages.map(message => 
      message.id === messageId ? { ...message, read: true } : message
    );
    localStorage.setItem("directMessages", JSON.stringify(updatedMessages));
    setDirectMessages(updatedMessages);
  };

  const deleteMessage = (messageId: number) => {
    const updatedMessages = directMessages.filter(message => message.id !== messageId);
    localStorage.setItem("directMessages", JSON.stringify(updatedMessages));
    setDirectMessages(updatedMessages);
    toast({
      title: "Success",
      description: "Message deleted successfully",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Direct Messages</h2>
        <div className="flex gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 border rounded-md p-2"
          >
            <option value="">Select a user</option>
            {users.map((user: any) => (
              <option key={user.email} value={user.email}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Type your message..."
                value={directMessage}
                onChange={(e) => setDirectMessage(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendDirectMessage} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
            <div className="space-y-4">
              {getMessagesWithUser(userEmail as string).length === 0 ? (
                <div className="text-center text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                getMessagesWithUser(userEmail as string).map((msg: any) => (
                  <Card
                    key={msg.id}
                    className={`p-4 ${
                      msg.from === userEmail ? "ml-auto bg-primary/10" : "mr-auto"
                    } max-w-[80%] relative`}
                  >
                    {!msg.read && msg.to === userEmail && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        New
                      </Badge>
                    )}
                    <div className="space-y-2">
                      <p className="text-gray-600">{msg.message}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{msg.from === userEmail ? "You" : msg.from}</span>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        {!msg.read && msg.to === userEmail && (
                          <Button variant="outline" size="sm" onClick={() => markAsRead(msg.id)}>
                            Mark as Read
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMessage(msg.id)}
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
        )}
      </div>
    </Card>
  );
};