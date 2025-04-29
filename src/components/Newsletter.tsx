import { useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
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
import { Button } from "@/components/ui/button";

interface NewsletterProps {
  setEmailPopupOpen: (value: boolean) => void;
  subscribeEmail: (email: string) => void;
}

const Newsletter = ({ setEmailPopupOpen, subscribeEmail }: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Invalid email address");
      return;
    }

    try {
      setLoading(true);
      await subscribeEmail(email);
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative max-w-md mx-auto w-full">
      <CardHeader>
        <CardTitle>Contest Alerts</CardTitle>
        <CardDescription>
          Never miss an upcoming coding contest!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            Subscribe to Alerts
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center w-full">
          You can unsubscribe at any time. No spam, we promise!
        </p>
      </CardFooter>
      <button
        className="absolute top-2 right-2 sm:top-3 sm:right-3 hover:bg-gray-800 dark:hover:bg-gray-400 hover:text-white dark:hover:text-black transition-colors cursor-pointer p-1 rounded-full"
        onClick={() => {
          setEmailPopupOpen(false);
          Cookies.set("emailSubscribed", "false", { expires: 7 });
        }}
      >
        <X className="size-3 sm:size-4" />
      </button>
    </Card>
  );
};

export default Newsletter;
