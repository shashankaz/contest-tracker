"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/user/reset-password-token?email=${email}`
      );

      if (response.status === 200) {
        toast.success("Email sent successfully!");
        setEmail("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Email not found. Please try again.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = () => {
    if (!email) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={handleDisable() || loading}
              >
                {loading ? (
                  <p className="flex items-center gap-2">
                    Sending email
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </p>
                ) : (
                  <p>Send Email</p>
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

export default ForgotPassword;
