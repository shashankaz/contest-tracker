"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/userContest";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { setUser, token, setToken } = useUser();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", form);

      if (response.status === 200) {
        toast.success("Login successful!");
        setForm({
          email: "",
          password: "",
        });
        setUser({
          id: response.data.user.id,
          token: response.data.token,
          name: response.data.user.name,
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.bio,
          profilePicture: response.data.user.profilePicture,
          newsletterSubscribed: response.data.user.newsletterSubscribed,
          reminderDelay: response.data.user.reminderDelay,
        });
        setToken(response.data.token);
        Cookies.set("token", response.data.token, { expires: 7 });

        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Invalid credentials. Please try again.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = () => {
    if (!form.email || form.password.length < 8) {
      return true;
    }
    return false;
  };

  if (token) {
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="johndoe@example.com"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    disabled={loading}
                  />
                  <div
                    className="absolute right-0 top-0 h-full px-3 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="rememberMe" />{" "}
                <Label htmlFor="rememberMe">Remember me for 30 days</Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={handleDisable() || loading}
              >
                {loading ? (
                  <p className="flex items-center gap-2">
                    Logging in
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </p>
                ) : (
                  <p>Login</p>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
