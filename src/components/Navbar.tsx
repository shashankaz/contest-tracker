"use client";

import { useEffect } from "react";
import { Comfortaa } from "next/font/google";
import { io } from "socket.io-client";
import axios from "axios";
import { Eye, SquareChevronLeft } from "lucide-react";
import { useLiveUsers, useOpen, useUser } from "@/store/useStore";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const comfortaa = Comfortaa({ subsets: ["latin"], weight: "700" });

const Navbar = () => {
  const { liveUsers, setLiveUsers } = useLiveUsers();
  const { setOpen } = useOpen();
  const { user } = useUser();

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL as string;
    const socket = io(socketUrl);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
    });

    socket.on("userCount", (count) => {
      console.log(`Received user count: ${count}`);
      setLiveUsers(count);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div className="flex items-center justify-between h-20 border-b">
      <h1
        className={`text-2xl md:text-4xl font-semibold ${comfortaa.className}`}
      >
        Contest Tracker Hub
      </h1>
      <div className="hidden md:flex items-center justify-end gap-3 py-4">
        <Button variant="secondary" title="Live users">
          <Eye /> {liveUsers} LIVE
        </Button>
        {/* <Button variant="secondary" title="Total visits">
          <User /> {"100"} VISITS
        </Button> */}
        <ModeToggle />
        {!user.token && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
        {user.token && (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>
        )}
      </div>
      <button className="flex md:hidden" onClick={() => setOpen(true)}>
        <SquareChevronLeft />
      </button>
    </div>
  );
};

export default Navbar;
