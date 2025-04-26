"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { Comfortaa } from "next/font/google";
import axios from "axios";
import { ExternalLink, Eye, Search, SquareChevronLeft } from "lucide-react";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { debounce } from "lodash";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import OverLay from "@/components/OverLay";
import Loading from "@/components/Loading";
import Newsletter from "@/components/Newsletter";
import { usePlatform } from "@/store/useStore";
import TableLoadingSkeleton from "@/components/TableLoadingSkeleton";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const comfortaa = Comfortaa({ subsets: ["latin"], weight: "700" });

interface Contest {
  contest_id: string;
  contest_name: string;
  contest_type: string;
  contest_phase: number;
  contest_date_start: string;
  contest_date_end: string;
  contest_origin: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const Home = () => {
  const [contest, setContest] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [open, setOpen] = useState(false);
  const [emailPopupOpen, setEmailPopupOpen] = useState(false);
  const [liveUsers, setLiveUsers] = useState(0);
  const [time, setTime] = useState(4);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  const { platform, setPlatform } = usePlatform();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userVisits, setUserVisits] = useState(0);

  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearchHandler = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearchHandler(value);
  };

  const updateCount = async () => {
    try {
      await axios.post("/api/unique-users");
    } catch (error) {
      console.error(error);
    }
  };

  const subscribeEmail = async (email: string) => {
    try {
      await axios.post(`/api/newsletter/subscribe?email=${email}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("visited");
    if (!token) {
      updateCount();
      localStorage.setItem("visited", "true");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setShowBookmarked((prev) => !prev);
      }
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        (/^[a-zA-Z0-9]$/.test(e.key) || e.key === "Backspace") &&
        document.activeElement &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement.tagName
        )
      ) {
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isEmailSubscribed = Cookies.get("emailSubscribed");
      if (!isEmailSubscribed) {
        setEmailPopupOpen(true);
        Cookies.set("emailSubscribed", "true");
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const fetchContest = async (pageNumber = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(
        `/api/contest/?page=${pageNumber}&limit=10&search=${debouncedSearch}&origin=${platform}`
      );
      setContest(response.data.contests);
      setPagination(response.data.pagination);
      setLastUpdatedAt(response.data.lastUpdatedAt);
    } catch (error) {
      console.error(error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContest(1, true);
    fetchVisits();
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );
    setBookmarkedContests(savedBookmarks);
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchContest();
    }
  }, [platform, debouncedSearch]);

  const contestLink = (platform: string, contest_id: string) => {
    switch (platform) {
      case "codeforces":
        return `https://codeforces.com/contests/${contest_id}`;
      case "codechef":
        return `https://www.codechef.com/${contest_id}`;
      case "leetcode":
        return `https://leetcode.com/contest/${contest_id}`;
      case "geeksforgeeks":
        return `https://practice.geeksforgeeks.org/contest/${contest_id}`;
      case "atcoder":
        return `https://atcoder.jp/contests/${contest_id}`;
      default:
        return "";
    }
  };

  const platformIcon = (platform: string) => {
    switch (platform) {
      case "codeforces":
        return "/codeforces.svg";
      case "codechef":
        return "/codechef.svg";
      case "leetcode":
        return "/leetcode.svg";
      case "geeksforgeeks":
        return "/geeksforgeeks.svg";
      case "atcoder":
        return "/atcoder.svg";
      default:
        return "";
    }
  };

  const fetchVisits = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unique-users`
    );
    setUserVisits(response.data.userCount);
  };

  useEffect(() => {
    setOpen(false);
  }, [platform, showBookmarked]);

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

  const handleBookmark = (id: string) => {
    let updatedBookmarks = [...bookmarkedContests];
    if (bookmarkedContests.includes(id)) {
      updatedBookmarks = updatedBookmarks.filter(
        (bookmarkId) => bookmarkId !== id
      );
      toast.success("Contest removed from bookmarks");
    } else {
      updatedBookmarks.push(id);
      toast.success("Contest added to bookmarks");
    }
    setBookmarkedContests(updatedBookmarks);
    localStorage.setItem(
      "bookmarkedContests",
      JSON.stringify(updatedBookmarks)
    );
  };

  const handlePageChange = (newPage: number) => {
    fetchContest(newPage);
  };

  const filteredContests = useMemo(() => {
    return showBookmarked
      ? contest.filter((contest) =>
          bookmarkedContests.includes(contest.contest_id)
        )
      : contest;
  }, [showBookmarked, contest, bookmarkedContests]);

  useEffect(() => {
    if (showBookmarked && filteredContests.length === 0) {
      const timer = setTimeout(() => {
        setShowBookmarked(false);
        setPlatform("");
        setTime(4);
      }, 4000);

      const countdown = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [showBookmarked, filteredContests.length, setPlatform]);

  useEffect(() => {
    setTime(4);
  }, [showBookmarked]);

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen px-4 sm:px-6 md:px-8 lg:px-10">
      <div>
        <div className="flex items-center justify-between h-20">
          <h1
            className={`text-3xl md:text-4xl font-semibold ${comfortaa.className}`}
          >
            Contest Tracker Hub
          </h1>
          <div className="hidden md:flex items-center justify-end gap-3">
            <div className="relative">
              <Input
                placeholder="Search Contest"
                value={search}
                onChange={handleSearchChange}
                className="pl-9 pr-12"
                ref={searchRef}
                disabled={loading}
              />
              <Search className="size-4 absolute top-1/2 -translate-1/2 left-5 text-gray-400" />
              <span className="flex items-center absolute top-1/2 -translate-1/2 -right-2">
                <span className="text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-300 rounded px-1 py-0.5">
                  Ctrl K
                </span>
              </span>
            </div>
            <Select
              value={platform}
              onValueChange={(
                value:
                  | "codeforces"
                  | "codechef"
                  | "leetcode"
                  | "geeksforgeeks"
                  | "atcoder"
              ) => {
                setPlatform(value);
                setSearch("");
                setDebouncedSearch("");
              }}
              disabled={loading}
            >
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="codeforces">Codeforces</SelectItem>
                <SelectItem value="codechef">CodeChef</SelectItem>
                <SelectItem value="leetcode">Leetcode</SelectItem>
                <SelectItem value="geeksforgeeks">GeeksforGeeks</SelectItem>
                <SelectItem value="atcoder">AtCoder</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowBookmarked(!showBookmarked)}
              disabled={loading}
            >
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
              search={search}
              handleSearchChange={handleSearchChange}
            />
          </div>
        )}
        {loading ? (
          <TableLoadingSkeleton />
        ) : filteredContests.length > 0 ? (
          <Table className="border">
            <TableCaption>
              Contest List{" "}
              <span className="text-xs text-gray-500">
                (Last updated:{" "}
                {new Date(lastUpdatedAt).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}{" "}
                IST)
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContests.map((contest) => {
                return (
                  <TableRow
                    key={contest.contest_id}
                    className={cn(
                      contest.contest_phase < 1
                        ? "bg-green-300 dark:bg-green-700"
                        : "bg-red-300 dark:bg-red-700"
                    )}
                  >
                    <TableCell
                      className="flex gap-2 items-center"
                      title={contest.contest_origin}
                    >
                      <Image
                        height={14}
                        width={14}
                        src={platformIcon(contest.contest_origin)}
                        alt={contest.contest_origin}
                        draggable={false}
                        className={`${
                          contest.contest_origin === "codechef" && "dark:invert"
                        } ${
                          contest.contest_origin === "atcoder" && "dark:invert"
                        } ${
                          contest.contest_origin === "geeksforgeeks" &&
                          "dark:invert"
                        }`}
                      />
                      {contest.contest_type}
                      {new Date() >= new Date(contest.contest_date_start) &&
                        new Date() <= new Date(contest.contest_date_end) && (
                          <span className="text-xs uppercase bg-white text-red-500 border border-red-500 px-3 py-0.5 rounded-2xl font-medium">
                            Live
                          </span>
                        )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={contestLink(
                          contest.contest_origin,
                          contest.contest_id
                        )}
                        target="_blank"
                        className="hover:underline flex items-center gap-2"
                        title="Visit Contest"
                      >
                        {contest.contest_name}
                        <ExternalLink className="stroke-1 size-4" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(contest.contest_date_start).toLocaleString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {Math.round(
                        Math.abs(
                          new Date(contest.contest_date_end).getTime() -
                            new Date(contest.contest_date_start).getTime()
                        ) /
                          (1000 * 60 * 60)
                      )}{" "}
                      hours
                    </TableCell>
                    <TableCell>
                      {new Date(contest.contest_date_end).toLocaleString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {contest.contest_phase < 1
                        ? new Date() >= new Date(contest.contest_date_start) &&
                          new Date() <= new Date(contest.contest_date_end)
                          ? `${formatDistanceToNow(
                              new Date(contest.contest_date_start)
                            )} passed`
                          : `${formatDistanceToNow(
                              new Date(contest.contest_date_start)
                            )} remaining`
                        : `${formatDistanceToNow(
                            new Date(contest.contest_date_start)
                          )} ago`}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleBookmark(contest.contest_id)}
                        title="Bookmark contest"
                        className="hover:cursor-pointer px-3"
                      >
                        {bookmarkedContests.includes(contest.contest_id) ? (
                          <Image
                            src="/unsave.svg"
                            height={100}
                            width={100}
                            alt="unsave"
                            className="size-5 min-w-5 dark:invert"
                          />
                        ) : (
                          <Image
                            src="/save.svg"
                            height={100}
                            width={100}
                            alt="save"
                            className="size-5 min-w-5 dark:invert"
                          />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            {showBookmarked ? (
              <span className="text-xl text-center">
                No bookmarked contests found. Redirect in {time}{" "}
                {time > 1 ? "seconds" : "second"}...
              </span>
            ) : (
              <span className="text-xl text-center">
                No contests found for your search criteria. Try adjusting your
                filters.
              </span>
            )}
          </div>
        )}
        {filteredContests.length > 0 && !showBookmarked && !loading && (
          <div className="flex justify-end my-4 gap-3">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
        {emailPopupOpen && (
          <div className="h-screen fixed inset-0 flex items-center justify-center bg-black/50">
            <Newsletter
              setEmailPopupOpen={setEmailPopupOpen}
              subscribeEmail={subscribeEmail}
            />
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4 pt-4 text-sm md:text-base">
          <h4 className="font-medium">Total Visits</h4>
          <div>
            {userVisits
              .toString()
              .split("")
              .map((item, idx: number) => {
                return (
                  <span
                    key={idx}
                    className="bg-primary text-primary-foreground shadow-xs py-1 md:py-2 px-2 md:px-3 rounded-sm mx-1 font-medium"
                  >
                    {item}
                  </span>
                );
              })}
          </div>
        </div>
        <p className="text-center py-4 md:py-6 text-sm md:text-base">
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
    </div>
  );
};

export default Home;
