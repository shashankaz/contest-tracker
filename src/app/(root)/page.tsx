"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import { ExternalLink, Eye, SquareChevronLeft } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OverLay from "@/components/OverLay";
import { usePlatform } from "@/store/useStore";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";

interface Contest {
  contest_id: string;
  contest_name: string;
  contest_type: string;
  contest_phase: number;
  contest_date_start: string;
  contest_date_end: string;
  contest_origin: string;
}

const Home = () => {
  const [contest, setContest] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  // const [platform, setPlatform] = useState("all");
  const [open, setOpen] = useState(false);
  const itemsPerPage = 10;
  const [liveUsers, setLiveUsers] = useState(0);

  const { platform, setPlatform } = usePlatform();

  const router = useRouter();

  const fetchContest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/contest/${platform}`);
      setContest(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContest();
    setCurrentPage(1);
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );
    setBookmarkedContests(savedBookmarks);
  }, [platform]);

  useEffect(() => {
    setOpen(false);
  }, [platform, showBookmarked]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKETS_URL as string;
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

  const handleRedirect = (origin: string, name: string) => {
    router.push(`/solution/?type=${origin}&name=${name}`);
  };

  const handleBookmark = (id: string) => {
    let updatedBookmarks = [...bookmarkedContests];
    if (bookmarkedContests.includes(id)) {
      updatedBookmarks = updatedBookmarks.filter(
        (bookmarkId) => bookmarkId !== id
      );
    } else {
      updatedBookmarks.push(id);
    }
    setBookmarkedContests(updatedBookmarks);
    localStorage.setItem(
      "bookmarkedContests",
      JSON.stringify(updatedBookmarks)
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredContests = useMemo(() => {
    return showBookmarked
      ? contest.filter((contest) =>
          bookmarkedContests.includes(contest.contest_id)
        )
      : contest;
  }, [showBookmarked, contest, bookmarkedContests]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredContests.length / itemsPerPage);
  }, [filteredContests.length, itemsPerPage]);

  const paginatedContests = useMemo(() => {
    return filteredContests.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredContests, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image
          src="/loading.svg"
          height={100}
          width={100}
          alt="Loading"
          className="dark:invert"
        />
        <h1 className="text-lg mt-3 font-medium text-center">
          Please wait, fetching contest details...
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between h-20">
        <h1 className="text-3xl md:text-4xl font-semibold">Contest Tracker</h1>
        <div className="hidden md:flex items-center justify-end gap-3">
          <Select
            value={platform}
            onValueChange={(
              value: "all" | "codeforces" | "codechef" | "leetcode"
            ) => setPlatform(value)}
          >
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="codeforces">Codeforces</SelectItem>
              <SelectItem value="codechef">Codechef</SelectItem>
              <SelectItem value="leetcode">Leetcode</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowBookmarked(!showBookmarked)}>
            {showBookmarked ? "Show All" : "Show Bookmarked"}
          </Button>
          <Button variant="secondary" title="Live users">
            <Eye /> {liveUsers}
          </Button>
          <ModeToggle />
        </div>
        <button className="flex md:hidden" onClick={() => setOpen(true)}>
          <SquareChevronLeft />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-10">
          <OverLay
            setOpen={setOpen}
            showBookmarked={showBookmarked}
            setShowBookmarked={setShowBookmarked}
            platform={platform}
            setPlatform={setPlatform}
            liveUsers={liveUsers}
          />
        </div>
      )}

      <Table>
        <TableCaption>
          Contest List{" "}
          <span className="text-xs text-gray-500">
            (Last updated: {new Date().toLocaleString()} IST, all times in IST)
          </span>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type/Platform</TableHead>
            <TableHead>Contest Name</TableHead>
            <TableHead>Start Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>End Date & Time</TableHead>
            <TableHead>Time remaining/passed</TableHead>
            <TableHead className="text-center">Save</TableHead>
            <TableHead className="text-center">Solution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedContests.map((contest) => {
            return (
              <TableRow
                key={contest.contest_id}
                className={cn(
                  contest.contest_phase < 1
                    ? "bg-green-300 dark:bg-green-700"
                    : "bg-red-300 dark:bg-red-700"
                )}
              >
                <TableCell className="flex gap-2 items-center">
                  {contest.contest_type}
                  {new Date() >= new Date(contest.contest_date_start) &&
                    new Date() <= new Date(contest.contest_date_end) && (
                      <span className="text-xs uppercase bg-white text-red-500 border border-red-500 px-3 py-0.5 rounded-2xl">
                        Live
                      </span>
                    )}
                </TableCell>
                <TableCell>{contest.contest_name}</TableCell>
                <TableCell>{contest.contest_date_start}</TableCell>
                <TableCell>
                  {Math.abs(
                    new Date(contest.contest_date_end).getTime() -
                      new Date(contest.contest_date_start).getTime()
                  ) /
                    (1000 * 60 * 60)}{" "}
                  hours
                </TableCell>
                <TableCell>{contest.contest_date_end}</TableCell>
                <TableCell>
                  {contest.contest_phase < 1
                    ? new Date() >= new Date(contest.contest_date_start) &&
                      new Date() <= new Date(contest.contest_date_end)
                      ? `${formatDistanceToNow(
                          new Date(contest.contest_date_start)
                        )} passed`
                      : `${formatDistanceToNow(
                          new Date(contest.contest_date_end)
                        )} remaining`
                    : `${formatDistanceToNow(
                        new Date(contest.contest_date_start)
                      )} ago`}
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleBookmark(contest.contest_id)}
                    title="Bookmark contest"
                    className="hover:cursor-pointer"
                  >
                    {bookmarkedContests.includes(contest.contest_id) ? (
                      <Image
                        src="/unsave.png"
                        height={100}
                        width={100}
                        alt="unsave"
                        className="size-4 dark:invert"
                      />
                    ) : (
                      <Image
                        src="/save.png"
                        height={100}
                        width={100}
                        alt="save"
                        className="size-4 dark:invert"
                      />
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() =>
                      handleRedirect(
                        contest.contest_origin,
                        contest.contest_name
                      )
                    }
                    disabled={contest.contest_phase === 0}
                    className="hover:cursor-pointer disabled:hover:cursor-not-allowed flex items-center gap-1 justify-center w-full"
                    title="View solution"
                  >
                    Visit <ExternalLink className="stroke-1 size-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-end my-4 gap-3">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
