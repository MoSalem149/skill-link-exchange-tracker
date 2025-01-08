import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Link as LinkIcon, LayoutDashboard, User, Home, Info, Mail, LogOut, BookOpen, MessageCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  email: string;
  fullName: string;
  profileImage?: string;
  role: 'user' | 'admin';
}

interface Message {
  from: string;
  to: string;
  read: boolean;
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const userData = JSON.parse(localStorage.getItem("users") || "[]").find(
      (u: User) => u.email === userEmail
    );
    setIsLoggedIn(!!userEmail);
    setIsAdmin(userRole === "admin");
    if (userData?.profileImage) {
      setUserImage(userData.profileImage);
    }
  }, []);

  useEffect(() => {
    const checkUnreadMessages = () => {
      const userEmail = localStorage.getItem("userEmail");
      const broadcasts = JSON.parse(localStorage.getItem("broadcasts") || "[]");
      const directMessages = JSON.parse(localStorage.getItem("directMessages") || "[]");

      const hasUnreadBroadcasts = broadcasts.some((b: Message) => !b.read && b.from !== userEmail);
      const hasUnreadDirectMessages = directMessages.some((m: Message) => !m.read && m.to === userEmail);

      setHasUnreadMessages(hasUnreadBroadcasts || hasUnreadDirectMessages);
    };

    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      navigate("/admin-profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">SkillLink</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text hover:text-primary transition-colors flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/about" className="text-text hover:text-primary transition-colors flex items-center gap-2">
              <Info className="h-4 w-4" />
              About Us
            </Link>
            <Link to="/contact" className="text-text hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Us
            </Link>
            {isLoggedIn && !isAdmin && (
              <>
                <Link to="/user-dashboard" className="text-text hover:text-primary transition-colors flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/study-room/1" className="text-text hover:text-primary transition-colors flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Study Room
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin-dashboard" className="text-text hover:text-primary transition-colors flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {isLoggedIn && (
              <>
                <Link to="/messages" className="text-text hover:text-primary transition-colors relative">
                  <MessageCircle className="h-6 w-6" />
                  {hasUnreadMessages && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Link>
                <button onClick={handleProfileClick} className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-primary flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/signup" className="btn-secondary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/about" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                <Info className="h-4 w-4" />
                About Us
              </Link>
              <Link to="/contact" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
              {isLoggedIn && !isAdmin && (
                <>
                  <Link to="/user-dashboard" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/study-room/1" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Study Room
                  </Link>
                  <Link to="/messages" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2 relative">
                    <MessageCircle className="h-4 w-4" />
                    Messages
                    {hasUnreadMessages && (
                      <span className="h-2 w-2 bg-red-500 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2" />
                    )}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin-dashboard" className="block px-3 py-2 text-text hover:text-primary flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-3 py-2 text-text hover:text-primary flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-text hover:text-primary flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-text hover:text-primary">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 text-text hover:text-primary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
