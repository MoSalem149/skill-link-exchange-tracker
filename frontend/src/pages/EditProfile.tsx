import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    skillToTeach: "",
    skillToLearn: "",
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === userEmail);
    
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData(user);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: any) =>
      user.email === formData.email ? formData : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast({
      title: "Success",
      description: "Your profile has been updated successfully!",
    });

    navigate("/user-dashboard");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="skillToTeach" className="block text-sm font-medium text-gray-700">
              Skill to Teach
            </label>
            <Input
              id="skillToTeach"
              name="skillToTeach"
              value={formData.skillToTeach}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="skillToLearn" className="block text-sm font-medium text-gray-700">
              Skill to Learn
            </label>
            <Input
              id="skillToLearn"
              name="skillToLearn"
              value={formData.skillToLearn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="bg-transparent ring-2 ring-gray-600">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user-dashboard")}
              className="bg-transparent ring-2 ring-gray-600 hover:none"
              >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;