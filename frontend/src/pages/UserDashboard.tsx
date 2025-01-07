import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, BookOpen, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "../lib/axios";

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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AcceptedConnection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'accepted';
  createdAt: Date;
}

interface PendingConnection {
  _id: string;
  senderId: {
    fullName: string;
    skillToTeach: string;
  };
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [acceptedConnections, setAcceptedConnections] = useState<AcceptedConnection[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch current user data
        const response = await api.get('/auth/profile');
        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);

          // Fetch all users
          const usersResponse = await api.get('/auth/users');
          if (usersResponse.data) {
            setUsers(usersResponse.data.filter(u => u.email !== response.data.user.email));
          } else {
            setUsers([]); // Explicitly set empty array if no data
            console.warn('No users data received from API');
          }
        }

        // Fetch accepted connections
        const connectionsResponse = await api.get('/connections/accepted');
        if (connectionsResponse.data) {
          setAcceptedConnections(connectionsResponse.data);
        }
      } catch (error: unknown) {
        const err = error as ApiError;
        console.error('Error fetching dashboard data:', err.response || err);
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [navigate, toast]);

  const stats = [
    {
      title: "Skills Exchanged",
      value: currentUser?.skillsExchanged.toString() || "0",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title: "Connected Users",
      value: currentUser?.connectedUsers.toString() || "0",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Messages",
      value: currentUser?.messageCount.toString() || "0",
      icon: <MessageSquare className="h-6 w-6" />,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const isConnected = acceptedConnections.some(
      conn => conn.senderId === user.email || conn.receiverId === user.email
    );

    return (
      !isConnected && (
        user.fullName.toLowerCase().includes(searchLower) ||
        user.skillToTeach.toLowerCase().includes(searchLower) ||
        user.skillToLearn.toLowerCase().includes(searchLower)
      )
    );
  });

  const handleConnect = async (userEmail: string) => {
    try {
      const response = await api.post('/connections/create', {
        receiverEmail: userEmail
      });

      if (response.data) {
        toast({
          title: "Request Sent",
          description: "Your connection request has been sent successfully!",
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const handleConnectionResponse = useCallback(async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await api.put(`/connections/${connectionId}`, { status });

      if (response.data) {
        // Remove the connection from accepted list if rejected
        setAcceptedConnections(prev => prev.filter(conn => conn.id !== connectionId));

        // If accepted, update the user's connection count
        if (status === 'accepted' && currentUser) {
          setCurrentUser(prev => prev ? {
            ...prev,
            connectedUsers: (prev.connectedUsers || 0) + 1
          } : null);
        }

        toast({
          title: status === 'accepted' ? "Connection Accepted" : "Connection Rejected",
          description: status === 'accepted'
            ? "You are now connected!"
            : "Connection request rejected",
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to respond to connection request",
        variant: "destructive",
      });
    }
  }, [currentUser, setCurrentUser, toast, setAcceptedConnections]);

  // Add notification for new connection request
  useEffect(() => {
    const checkPendingConnections = async () => {
      try {
        const response = await api.get('/connections/pending');
        if (response.data && response.data.length > 0) {
          response.data.forEach((connection: PendingConnection) => {
            toast({
              title: "New Connection Request",
              description: (
                <div className="space-y-2">
                  <p>{connection.senderId.fullName} wants to connect with you!</p>
                  <p className="text-sm">They teach: {connection.senderId.skillToTeach}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleConnectionResponse(connection._id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConnectionResponse(connection._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ),
              duration: 10000,
            });
          });
        }
      } catch (error) {
        console.error('Error checking pending connections:', error);
      }
    };

    checkPendingConnections();
    const interval = setInterval(checkPendingConnections, 30000);

    return () => clearInterval(interval);
  }, [handleConnectionResponse, toast]);

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser.fullName}!</h1>
          <p className="text-gray-500 mt-2">Manage your skills and connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {acceptedConnections.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
            <div className="space-y-4">
              {acceptedConnections.map((connection) => {
                const connectedUser = users.find(u =>
                  u.email === connection.senderId || u.email === connection.receiverId
                );
                if (!connectedUser) return null;

                return (
                  <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{connectedUser.fullName}</p>
                      <p className="text-sm text-gray-500">Teaches: {connectedUser.skillToTeach}</p>
                      <p className="text-sm text-gray-500">Wants to learn: {connectedUser.skillToLearn}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => window.location.href = `mailto:${connectedUser.email}`}
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Skills</h2>
            <Button onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100">
              Edit Skills
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700">Skills to Teach</h3>
              <p className="mt-2">{currentUser.skillToTeach}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700">Skills to Learn</h3>
              <p className="mt-2">{currentUser.skillToLearn}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Find Users</h2>
            <Input
              type="search"
              placeholder="Search by name or skill..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.email}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-700">{user.fullName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Teaches: {user.skillToTeach}
                </p>
                <p className="text-sm text-gray-500">
                  Learns: {user.skillToLearn}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => handleConnect(user.email)}
                    className="w-full ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
