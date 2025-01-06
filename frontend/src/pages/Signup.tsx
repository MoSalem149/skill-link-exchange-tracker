import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {TermsAndConditions} from "./TermsAndConditions"
const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    skillToTeach: "",
    skillToLearn: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if email already exists
      if (existingUsers.some((user: any) => user.email === formData.email)) {
        toast({
          title: "Error",
          description: "Email already exists",
          variant: "destructive",
        });
        return;
      }

      // Add new user
      const newUsers = [...existingUsers, formData];
      localStorage.setItem("users", JSON.stringify(newUsers));
      console.log("Users after signup:", newUsers); // Debug log

      toast({
        title: "Success!",
        description: "Your account has been created. Please login.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: "Something went wrong during signup",
        variant: "destructive",
      });
    }
  };
  const [setTerms, setTermsValue] = useState({
    IsChecked: false,
    termsChecked: false
  });
  function handleCheckboxChange(event) {
    setTermsValue({...setTerms, IsChecked: event.target.checked});
  }
  function handlePrivacyPolicy(event){
    setTermsValue({...setTerms, termsChecked: event.target.checked})
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>
          <p className="text-center text-gray-500">Enter your details to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="skillToTeach"
                placeholder="Skill you can teach"
                value={formData.skillToTeach}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="skillToLearn"
                placeholder="Skill you want to learn"
                value={formData.skillToLearn}
                onChange={handleChange}
                required
              />
              <div>
                <input 
                type="checkbox"
                checked={setTerms.IsChecked}
                onChange={handleCheckboxChange}
                />
                <label>
                  By Acceping you agree to our <a href="/terms" className="text-blue-400 bg-white cursor-pointer"> Terms and Condation</a>
                </label>
                <br />
                <input 
                type="checkbox"
                checked={setTerms.termsChecked}
                onChange={handlePrivacyPolicy}
                />
                <label>
                  By Acceping you agree to our <a href="/privacy-policy" className="text-blue-400 bg-white cursor-pointer"> Privacy and Policy</a> conditiions
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
