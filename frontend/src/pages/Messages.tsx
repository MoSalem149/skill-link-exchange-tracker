import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BroadcastSection } from "@/components/messages/BroadcastSection";
import { DirectMessageSection } from "@/components/messages/DirectMessageSection";
import { api } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

interface User {
  email: string;
  fullName: string;
  skillToTeach: string;
  skillToLearn: string;
  role: 'user' | 'admin';
  skillsExchanged?: number;
  connectedUsers?: number;
  messageCount?: number;
}

interface Broadcast {
  id: string;
  from: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface DirectMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Messages = () => {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [directMessage, setDirectMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        // Filter users to only include those with role 'user' and exclude current user
        const filteredUsers = response.data.filter((user: User) =>
          user.role === 'user' && user.email !== userEmail
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, [userEmail, toast]);

  useEffect(() => {
    const storedBroadcasts = JSON.parse(localStorage.getItem("broadcasts") || "[]");
    const storedMessages = JSON.parse(localStorage.getItem("directMessages") || "[]");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setBroadcasts(storedBroadcasts);
    setDirectMessages(storedMessages);
    setUsers(storedUsers.filter((user: User) => user.email !== userEmail));
  }, [userEmail]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <Tabs defaultValue="broadcasts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="broadcasts">
              Broadcasts
              {broadcasts.some(b => !b.read && b.from !== userEmail) && (
                <span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="direct">
              Direct Messages
              {directMessages.some(m => !m.read && m.to === userEmail) && (
                <span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="broadcasts">
            <BroadcastSection
              isAdmin={isAdmin}
              broadcasts={broadcasts}
              setBroadcasts={setBroadcasts}
              userEmail={userEmail}
            />
          </TabsContent>

          <TabsContent value="direct">
            <DirectMessageSection
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              directMessage={directMessage}
              setDirectMessage={setDirectMessage}
              directMessages={directMessages}
              setDirectMessages={setDirectMessages}
              users={users}
              userEmail={userEmail}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
