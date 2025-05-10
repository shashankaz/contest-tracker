"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface FooterProps {
  subscribeEmail: (email: string) => void;
}

const Footer: React.FC<FooterProps> = ({ subscribeEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
    <div className="dark:bg-white/10 mb-4 md:mb-10 rounded-xl p-6 md:p-8 mt-20 border dark:border-white/10">
      <div className="mb-4 flex flex-col md:flex-row items-start justify-between gap-8 md:gap-20">
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            Contest Tracker Hub
          </h2>
          <p>
            A one-stop solution for all your competitive programming needs. We
            provide a comprehensive list of upcoming coding contests from
            various platforms, along with a countdown timer to help you stay
            updated.
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl sm:text-3xl font-semibold">Contest Alerts</h2>
          <p>Never miss an upcoming coding contest!</p>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleSubmit}
              className="w-fit text-sm"
              disabled={loading}
            >
              Subscribe
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/3 grid grid-cols-2">
          <ul className="flex flex-col gap-2 text-sm font-medium">
            <li className="mb-2 text-primary">Navigate</li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:underline">
                API Docs
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:underline">
                Feedback
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-2 text-sm font-medium">
            <li className="mb-2 text-primary">Social</li>
            <li>
              <Link
                href="https://facebook.com/shashankaz"
                target="_blank"
                className="hover:underline"
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com/shashankaz"
                target="_blank"
                className="hover:underline"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com/shashankaz"
                target="_blank"
                className="hover:underline"
              >
                X
              </Link>
            </li>
            <li>
              <Link
                href="https://linkedin.com/in/shashankaz"
                target="_blank"
                className="hover:underline"
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[1px] bg-black/10 dark:bg-white/10 my-8"></div>
      <p className="text-sm md:text-base text-center">
        Made with ❤️ by{" "}
        <Link
          href="https://x.com/shashankaz"
          target="_blank"
          className="hover:underline"
        >
          Shashank
        </Link>
      </p>
    </div>
  );
};

export default Footer;
