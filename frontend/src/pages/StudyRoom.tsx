import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Video, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChatSection } from "@/components/study-room/ChatSection";
import { ProgressSection } from "@/components/study-room/ProgressSection";
import { RatingSection } from "@/components/study-room/RatingSection";
import { io, Socket } from 'socket.io-client';
import studyRoomService from "@/services/studyRoomService";

interface Message {
  id: number;
  from: string;
  content: string;
  timestamp: string;
}

interface Meeting {
  date: string;
  scheduled: string;
}

interface StudyRoom {
  id: number;
  participants: string[];
  progress: number;
  messages: Message[];
  meetings: Meeting[];
  isCompleted: boolean;
  completedAt: Date | null;
}

interface ConnectedUser {
  email: string;
  fullName: string;
  online: boolean;
}

const StudyRoom = () => {
  const { roomId } = useParams();
  const { toast } = useToast();
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const userEmail = localStorage.getItem("userEmail");
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      // Join study room
      newSocket.emit('joinStudyRoom', { roomId, userEmail });
    });

    newSocket.on('userJoined', (users: ConnectedUser[]) => {
      setConnectedUsers(users);
      toast({
        title: "User Joined",
        description: "A new user has joined the study room",
      });
    });

    newSocket.on('userLeft', (users: ConnectedUser[]) => {
      setConnectedUsers(users);
      toast({
        title: "User Left",
        description: "A user has left the study room",
      });
    });

    newSocket.on('newMessage', (newMessage: Message) => {
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          messages: [...prevRoom.messages, newMessage]
        };
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leaveStudyRoom', { roomId, userEmail });
      newSocket.close();
    };
  }, [roomId, userEmail, toast]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await studyRoomService.getRoom(roomId);

        // Only create a new room if the current one is completed
        if (roomData.isCompleted) {
          toast({
            title: "Room Completed",
            description: "This study room has been completed.",
          });
          navigate('/user-dashboard');
        }

        setRoom(roomData);
      } catch (error) {
        console.error('Error fetching room:', error);
        toast({
          title: "Error",
          description: "Failed to load study room",
          variant: "destructive",
        });
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, toast, navigate, userEmail]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const newMessage = {
      id: Date.now(),
      from: userEmail,
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Emit message through WebSocket
    socket.emit('sendMessage', {
      roomId,
      message: newMessage
    });

    // Update local state
    setRoom(prevRoom => {
      if (!prevRoom) return null;
      return {
        ...prevRoom,
        messages: [...prevRoom.messages, newMessage]
      };
    });

    setMessage("");
  };

  const updateProgress = async (newProgress: number) => {
    try {
      const updatedRoom = await studyRoomService.updateProgress(roomId, newProgress);
      setRoom(prev => prev ? { ...prev, progress: newProgress } : null);

      if (newProgress === 100) {
        setIsCompleted(true);
        toast({
          title: "Congratulations! 🎉",
          description: "You've completed this study room! Your skills exchanged count has been updated.",
        });

        // Wait for 3 seconds before redirecting
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 5000);
      } else {
        toast({
          title: "Success",
          description: `Progress updated to ${newProgress}%`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const submitRating = (value: number) => {
    setRating(value);
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const scheduleSession = (date: Date | undefined) => {
    if (!date || !socket) return;

    const newMeeting = {
      date: date.toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Emit meeting through WebSocket
    socket.emit('scheduleMeeting', {
      roomId,
      meeting: newMeeting
    });

    // Update local state
    setRoom(prevRoom => {
      if (!prevRoom) return null;
      return {
        ...prevRoom,
        meetings: [...prevRoom.meetings, newMeeting]
      };
    });

    setShowCalendar(false);
    setSelectedDate(date);

    toast({
      title: "Session Scheduled",
      description: `Study session scheduled for ${date.toLocaleDateString()}`,
    });
  };

  if (!room) return null;

  return (
    <DashboardLayout>
      {isCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p className="mb-4">
              You've successfully completed this study room! Your skills exchanged count has been updated.
            </p>
            <p className="mb-4">
              You'll be redirected to the dashboard in a moment...
            </p>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Study Room</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.open("https://meet.google.com", "_blank")}
              className="flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100"
            >
              <Video className="h-4 w-4" />
              Start Meeting
            </Button>
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100"
            >
              <CalendarIcon className="h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Connected Users Section */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Connected Users</h2>
          <div className="space-y-2">
            {connectedUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between">
                <span>{user.fullName}</span>
                <span className={`h-3 w-3 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </Card>

        <ProgressSection progress={room.progress} updateProgress={updateProgress} />

        {showCalendar && (
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={scheduleSession}
              className="rounded-md border"
            />
          </Card>
        )}

        <RatingSection rating={rating} submitRating={submitRating} />

        <ChatSection
          messages={room.messages}
          message={message}
          userEmail={userEmail}
          setMessage={setMessage}
          sendMessage={sendMessage}
          connectedUsers={connectedUsers}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudyRoom;
