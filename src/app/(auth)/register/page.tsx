"use client";

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { debounce } from "lodash";

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
import { useUser } from "@/context/userContest";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  const { setUser, token, setToken } = useUser();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/user/register", form);

      if (response.status === 201) {
        toast.success("Registration successful!");
        setForm({
          name: "",
          username: "",
          email: "",
          password: "",
          terms: false,
        });
        setUser({
          id: response.data.user.id,
          token: response.data.token,
          name: response.data.user.name,
          username: response.data.user.username,
          email: response.data.user.email,
          profilePicture: response.data.user.profilePicture,
          newsletterSubscribed: response.data.user.newsletterSubscribed,
        });
        setToken(response.data.token);
        Cookies.set("token", response.data.token, { expires: 7 });

        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Username or email already exists.");
        } else if (error.response?.status === 400) {
          toast.error("Invalid data. Please check your input.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async (username: string) => {
    try {
      const response = await axios.get(`/api/user/${username}`);
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const checkUsername = async () => {
      if (form.username.length < 3) return;
      const isAvailable = await fetchUsername(form.username);
      setUsernameAvailable(isAvailable);
    };

    const debouncedCheck = debounce(checkUsername, 500);
    debouncedCheck();

    return () => {
      debouncedCheck.cancel();
    };
  }, [form.username]);

  const handleDisabled = () => {
    if (
      !form.name ||
      form.username.length < 3 ||
      !form.email ||
      form.password.length < 8 ||
      !usernameAvailable
    ) {
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
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username (min. 3 characters)</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="johndoe"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div
                    className="absolute right-0 top-0 h-full px-3 flex items-center justify-center"
                    title={
                      usernameAvailable
                        ? "Username available"
                        : "Username taken"
                    }
                  >
                    {form.username.length >= 3 &&
                      (usernameAvailable ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      ))}
                    <span className="sr-only">
                      {form.username.length > 3 && usernameAvailable
                        ? "Username available"
                        : "Username taken"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="johndoe@example.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (min. 8 characters)</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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
              <Button
                type="submit"
                className="w-full"
                disabled={handleDisabled() || loading}
              >
                {loading ? (
                  <p className="flex items-center gap-2">
                    Registering
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </p>
                ) : (
                  <p>Register</p>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
