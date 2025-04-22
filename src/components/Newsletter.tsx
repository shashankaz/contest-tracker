import { useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface NewsletterProps {
  setEmailPopupOpen: (value: boolean) => void;
  subscribeEmail: (email: string) => void;
}

const Newsletter = ({ setEmailPopupOpen, subscribeEmail }: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      toast.error("Invalid email address");
      return;
    }

    try {
      setLoading(true);
      subscribeEmail(email);
      setEmailPopupOpen(false);
      toast.success("Subscribed to newsletter");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] sm:w-[450px] md:w-[500px] mx-4 p-6 sm:p-8 md:p-10 bg-gray-100 dark:bg-black text-black dark:text-white border rounded-md flex flex-col items-center justify-center gap-4 relative">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
        Contest Alerts
      </h1>
      <div className="text-center space-y-2">
        <p className="text-base sm:text-lg">
          Never miss an upcoming coding contest!
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Get email notifications for contests from LeetCode, CodeChef, and
          Codeforces
        </p>
      </div>
      <div className="w-full">
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full text-sm">
        Subscribe to Alerts
      </Button>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
        You can unsubscribe at any time. No spam, we promise!
      </p>
      <button
        className="absolute top-2 right-2 sm:top-3 sm:right-3 hover:bg-gray-800 dark:hover:bg-gray-400 hover:text-white dark:hover:text-black transition-colors cursor-pointer p-1 rounded-full"
        onClick={() => {
          setEmailPopupOpen(false);
          Cookies.set("emailSubscribed", "false", { expires: 7 });
        }}
      >
        <X className="size-3 sm:size-4" />
      </button>
    </div>
  );
};

export default Newsletter;
