"use client";

import { useEffect } from "react";
import { Comfortaa } from "next/font/google";
import { io } from "socket.io-client";
import axios from "axios";
import { Eye, SquareChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./theme-toggle";
import { useLiveUsers, useOpen } from "@/store/useStore";
import { useUser } from "@/context/userContest";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const comfortaa = Comfortaa({ subsets: ["latin"], weight: "700" });

const Navbar = () => {
  const { liveUsers, setLiveUsers } = useLiveUsers();
  const { setOpen } = useOpen();
  const { user, token } = useUser();

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

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex items-center justify-between h-20">
      <Link href="/">
        <h1
          className={`text-2xl md:text-4xl font-semibold ${comfortaa.className}`}
        >
          Contest Tracker Hub
        </h1>
      </Link>
      <div className="hidden md:flex items-center justify-end gap-3 py-4">
        <Button variant="secondary" title="Live users">
          <Eye /> {liveUsers} LIVE
        </Button>
        {/* <Button variant="secondary" title="Total visits">
          <User /> {"100"} VISITS
        </Button> */}
        <ModeToggle />
        {!token && !user && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
        {token && user && (
          <Link href="/profile">
            <Avatar>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
      <button className="flex md:hidden" onClick={() => setOpen(true)}>
        <SquareChevronLeft />
      </button>
    </div>
  );
};

export default Navbar;
