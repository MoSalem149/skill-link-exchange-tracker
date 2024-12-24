import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, BookOpen, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [users] = useState(() => {
    return JSON.parse(localStorage.getItem("users") || "[]");
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Total Skills",
      value: users.reduce((acc: number, user: any) => {
        const teachSkills = user.skillToTeach ? 1 : 0;
        const learnSkills = user.skillToLearn ? 1 : 0;
        return acc + teachSkills + learnSkills;
      }, 0),
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title: "Average Rating",
      value: "4.8/5",
      icon: <Star className="h-6 w-6" />,
    },
  ];

  const handleDeleteUser = (email: string) => {
    const updatedUsers = users.filter((user: any) => user.email !== email);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your platform and users</p>
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

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills to Teach
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills to Learn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: any) => (
                    <tr key={user.email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.skillToTeach}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.skillToLearn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;