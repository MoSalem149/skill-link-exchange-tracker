import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BroadcastSection } from "@/components/messages/BroadcastSection";
import { DirectMessageSection } from "@/components/messages/DirectMessageSection";

const Messages = () => {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [directMessage, setDirectMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const storedBroadcasts = JSON.parse(localStorage.getItem("broadcasts") || "[]");
    const storedMessages = JSON.parse(localStorage.getItem("directMessages") || "[]");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setBroadcasts(storedBroadcasts);
    setDirectMessages(storedMessages);
    setUsers(storedUsers.filter((user: any) => user.email !== userEmail));
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