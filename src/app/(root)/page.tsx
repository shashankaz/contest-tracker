"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { addHours, addMinutes, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { debounce } from "lodash";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { motion } from "motion/react";

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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OverLay from "@/components/OverLay";
import Newsletter from "@/components/Newsletter";
import { useLiveUsers, useOpen, usePlatform } from "@/store/useStore";
import TableLoadingSkeleton from "@/components/TableLoadingSkeleton";
import LoadingNew from "@/components/LoadingNew";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contestLink } from "@/lib/contestLink";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

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
  const [upcomingContest, setUpcomingContest] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [emailPopupOpen, setEmailPopupOpen] = useState(false);
  // const [time, setTime] = useState(4);
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
  // const [userVisits, setUserVisits] = useState(0);

  const { liveUsers } = useLiveUsers();
  const { open, setOpen } = useOpen();

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
      const response = await axios.post(
        `/api/newsletter/subscribe?email=${email}`
      );

      if (response.status === 201) {
        toast.success("Subscribed to newsletter");
        setEmailPopupOpen(false);
        Cookies.set("emailSubscribed", "true");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
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
        Cookies.set("emailSubscribed", "false", { expires: 7 });
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
        `/api/contest/?page=${pageNumber}&limit=10&search=${debouncedSearch}&origin=${platform}&upcoming=false`
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

  const fetchUpcomingContests = async (pageNumber = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(
        `/api/contest/?page=${pageNumber}&limit=100&search=${debouncedSearch}&origin=${platform}&upcoming=true`
      );
      setUpcomingContest(response.data.contests);
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
    fetchUpcomingContests();
    // fetchVisits();
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

  const handleResetFilters = () => {
    setPlatform("");
    setSearch("");
    setDebouncedSearch("");
    setShowBookmarked(false);
    setOpen(false);
  };

  // const fetchVisits = async () => {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_URL}/api/unique-users`
  //   );
  //   setUserVisits(response.data.userCount);
  // };

  const getTimeRemaining = (contest: Contest) => {
    const now = addMinutes(addHours(new Date(), 5), 30);
    const start = new Date(contest.contest_date_start);
    const end = new Date(contest.contest_date_end);

    if (now < start) {
      return `${formatDistanceToNow(
        addMinutes(addHours(start, -5), -30)
      )} remaining`;
    } else if (now >= start && now <= end) {
      return `${formatDistanceToNow(
        addMinutes(addHours(start, -5), -30)
      )} passed`;
    } else {
      return `${formatDistanceToNow(addMinutes(addHours(end, -5), -30))} ago`;
    }
  };

  const getLiveContest = (contest: Contest) => {
    const now = addMinutes(addHours(new Date(), 5), 30);
    const start = new Date(contest.contest_date_start);
    const end = new Date(contest.contest_date_end);

    if (now >= start && now <= end) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setOpen(false);
  }, [platform, showBookmarked]);

  const saveBookmark = async (contestDetails: Contest) => {
    try {
      const response = await axios.post(
        "/api/user/save-contest",
        {
          contestDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Contest added to bookmarks");
      } else {
        toast.error("Failed to save bookmarks. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save bookmarks. Please try again later.");
    }
  };

  const deleteBookmark = async (contestDetails: Contest) => {
    try {
      const response = await axios.delete(
        `/api/user/delete-contest/?contestId=${contestDetails.contest_id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Contest removed from bookmarks");
      } else {
        toast.error("Failed to remove contest. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove contest. Please try again later.");
    }
  };

  const handleBookmark = (contest: Contest) => {
    let updatedBookmarks = [...bookmarkedContests];
    if (bookmarkedContests.includes(contest.contest_id)) {
      updatedBookmarks = updatedBookmarks.filter(
        (bookmarkId) => bookmarkId !== contest.contest_id
      );
      deleteBookmark(contest);
    } else {
      updatedBookmarks.push(contest.contest_id);
      saveBookmark(contest);
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

  // useEffect(() => {
  //   if (showBookmarked && filteredContests.length === 0) {
  //     const timer = setTimeout(() => {
  //       setShowBookmarked(false);
  //       setPlatform("");
  //       setTime(4);
  //     }, 4000);

  //     const countdown = setInterval(() => {
  //       setTime((prevTime) => prevTime - 1);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timer);
  //       clearInterval(countdown);
  //     };
  //   }
  // }, [showBookmarked, filteredContests.length, setPlatform]);

  // useEffect(() => {
  //   setTime(4);
  // }, [showBookmarked]);

  if (initialLoading) {
    return <LoadingNew />;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen px-4 sm:px-6 md:px-8 lg:px-10">
      <div>
        <Navbar />
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

        <div className="bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-900 dark:to-purple-900 py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-10 rounded-3xl">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Never Miss a Coding Contest
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay updated with upcoming coding contests from popular platforms
              like Codeforces, CodeChef, LeetCode and more.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-3 py-1.5"
              >
                <Image
                  height={16}
                  width={16}
                  src="/codeforces.svg"
                  alt="Codeforces"
                  className="mr-2"
                />
                Codeforces
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-3 py-1.5"
              >
                <Image
                  height={16}
                  width={16}
                  src="/codechef.svg"
                  alt="CodeChef"
                  className="mr-2"
                />
                CodeChef
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-3 py-1.5"
              >
                <Image
                  height={16}
                  width={16}
                  src="/leetcode.svg"
                  alt="LeetCode"
                  className="mr-2"
                />
                LeetCode
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-3 py-1.5"
              >
                <Image
                  height={16}
                  width={16}
                  src="/geeksforgeeks.svg"
                  alt="GeeksforGeeks"
                  className="mr-2 dark:invert"
                />
                GeeksforGeeks
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 px-3 py-1.5"
              >
                <Image
                  height={16}
                  width={16}
                  src="/atcoder.svg"
                  alt="AtCoder"
                  className="mr-2 dark:invert"
                />
                AtCoder
              </Badge>
            </motion.div>
          </div>
        </div>

        <div className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Upcoming Contests
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <Table className="border-collapse">
              <TableCaption className="py-4">
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
                <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                  <TableHead className="font-semibold">Type/Platform</TableHead>
                  <TableHead className="font-semibold">Contest Name</TableHead>
                  <TableHead className="font-semibold">
                    Start Date & Time
                  </TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">
                    End Date & Time
                  </TableHead>
                  <TableHead className="font-semibold">
                    Time remaining
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingContest.map((contest) => {
                  const isLive = getLiveContest(contest);
                  return (
                    <TableRow
                      key={contest.contest_id}
                      className={`${
                        isLive ? "bg-green-50/50 dark:bg-green-900/10" : ""
                      } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                    >
                      <TableCell
                        className="flex gap-2 items-center"
                        title={contest.contest_origin}
                      >
                        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
                          <Image
                            height={16}
                            width={16}
                            src={platformIcon(contest.contest_origin)}
                            alt={contest.contest_origin}
                            draggable={false}
                            className={`${
                              contest.contest_origin === "codechef" &&
                              "dark:invert"
                            } ${
                              contest.contest_origin === "atcoder" &&
                              "dark:invert"
                            } ${
                              contest.contest_origin === "geeksforgeeks" &&
                              "dark:invert"
                            }`}
                          />
                        </div>
                        <span className="font-medium">
                          {contest.contest_type}
                        </span>
                        {isLive && (
                          <span className="text-xs uppercase bg-red-50 text-red-500 border border-red-200 px-3 py-0.5 ml-1 rounded-full font-medium animate-pulse">
                            Live
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={contestLink(
                                  contest.contest_origin,
                                  contest.contest_id
                                )}
                                target="_blank"
                                className="hover:underline flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400"
                              >
                                {contest.contest_name}
                                <ExternalLink className="stroke-1 size-4" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Visit Contest Page</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
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
                        <Badge
                          variant="outline"
                          className="bg-gray-50 dark:bg-gray-700 font-normal"
                        >
                          {Math.round(
                            Math.abs(
                              new Date(contest.contest_date_end).getTime() -
                                new Date(contest.contest_date_start).getTime()
                            ) /
                              (1000 * 60 * 60)
                          )}{" "}
                          hours
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
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
                      <TableCell className="whitespace-nowrap">
                        <span
                          className={`${
                            isLive
                              ? "text-green-600 dark:text-green-400 font-medium"
                              : ""
                          }`}
                        >
                          {getTimeRemaining(contest)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 lg:p-10 rounded-sm bg-gray-50 dark:bg-gray-900/30">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Past Contests
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-medium">Filters</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="bg-white dark:bg-gray-800"
                  >
                    Reset Filters
                  </Button>

                  <div className="relative flex-1 md:flex-none">
                    <Input
                      placeholder="Search Contest"
                      value={search}
                      onChange={handleSearchChange}
                      className="pl-9 pr-12 bg-white dark:bg-gray-800 min-w-[250px]"
                      ref={searchRef}
                      disabled={loading}
                    />
                    <Search className="size-4 absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                    <span className="flex items-center absolute top-1/2 -translate-y-1/2 right-3">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded px-1.5 py-0.5">
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
                    <SelectTrigger className="sm:w-[180px] bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="codeforces">Codeforces</SelectItem>
                      <SelectItem value="codechef">CodeChef</SelectItem>
                      <SelectItem value="leetcode">Leetcode</SelectItem>
                      <SelectItem value="geeksforgeeks">
                        GeeksforGeeks
                      </SelectItem>
                      <SelectItem value="atcoder">AtCoder</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => setShowBookmarked(!showBookmarked)}
                    disabled={loading}
                    variant={showBookmarked ? "secondary" : "outline"}
                    className={
                      showBookmarked ? "" : "bg-white dark:bg-gray-800"
                    }
                  >
                    {showBookmarked ? (
                      <p className="flex items-center gap-2">
                        <Bookmark className="size-4" /> Show All
                      </p>
                    ) : (
                      <p className="flex items-center gap-2">
                        <BookmarkCheck className="size-4" />
                        Show Saved
                      </p>
                    )}
                  </Button>
                </div>
              </div>

              {loading ? (
                <TableLoadingSkeleton />
              ) : filteredContests.length > 0 ? (
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                      <TableHead className="font-semibold">
                        Type/Platform
                      </TableHead>
                      <TableHead className="font-semibold">
                        Contest Name
                      </TableHead>
                      <TableHead className="font-semibold">
                        Start Date & Time
                      </TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">
                        End Date & Time
                      </TableHead>
                      <TableHead className="font-semibold">
                        Time passed
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Save
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContests.map((contest) => {
                      const isLive = getLiveContest(contest);
                      const isBookmarked = bookmarkedContests.includes(
                        contest.contest_id
                      );

                      return (
                        <TableRow
                          key={contest.contest_id}
                          className={`${
                            isLive ? "bg-green-50/50 dark:bg-green-900/10" : ""
                          } 
                            ${
                              isBookmarked
                                ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                                : ""
                            }
                            hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                        >
                          <TableCell
                            className="flex gap-2 items-center"
                            title={contest.contest_origin}
                          >
                            <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
                              <Image
                                height={16}
                                width={16}
                                src={platformIcon(contest.contest_origin)}
                                alt={contest.contest_origin}
                                draggable={false}
                                className={`${
                                  contest.contest_origin === "codechef" &&
                                  "dark:invert"
                                } ${
                                  contest.contest_origin === "atcoder" &&
                                  "dark:invert"
                                } ${
                                  contest.contest_origin === "geeksforgeeks" &&
                                  "dark:invert"
                                }`}
                              />
                            </div>
                            <span className="font-medium">
                              {contest.contest_type}
                            </span>
                            {isLive && (
                              <span className="text-xs uppercase bg-red-50 text-red-500 border border-red-200 px-3 py-0.5 ml-1 rounded-full font-medium animate-pulse">
                                Live
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={contestLink(
                                      contest.contest_origin,
                                      contest.contest_id
                                    )}
                                    target="_blank"
                                    className="hover:underline flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400"
                                  >
                                    {contest.contest_name}
                                    <ExternalLink className="stroke-1 size-4" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Visit Contest Page</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(
                              contest.contest_date_start
                            ).toLocaleString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "UTC",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-gray-50 dark:bg-gray-700 font-normal"
                            >
                              {Math.round(
                                Math.abs(
                                  new Date(contest.contest_date_end).getTime() -
                                    new Date(
                                      contest.contest_date_start
                                    ).getTime()
                                ) /
                                  (1000 * 60 * 60)
                              )}{" "}
                              hours
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
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
                          <TableCell className="whitespace-nowrap">
                            <span
                              className={`${
                                isLive
                                  ? "text-green-600 dark:text-green-400 font-medium"
                                  : ""
                              }`}
                            >
                              {getTimeRemaining(contest)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleBookmark(contest)}
                                    className="hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    {isBookmarked ? (
                                      <BookmarkCheck className="size-5 text-yellow-500" />
                                    ) : (
                                      <Bookmark className="size-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  {isBookmarked
                                    ? "Remove from bookmarks"
                                    : "Add to bookmarks"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  {showBookmarked ? (
                    <div className="text-center">
                      <BookmarkCheck className="size-12 mx-auto text-gray-400 mb-4" />
                      <span className="text-xl font-medium">
                        No saved contests found.
                      </span>
                      <p className="text-gray-500 mt-2 max-w-md">
                        Try bookmarking some contests by clicking the bookmark
                        icon.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Search className="size-12 mx-auto text-gray-400 mb-4" />
                      <span className="text-xl font-medium">
                        No contests found for your search criteria.
                      </span>
                      <p className="text-gray-500 mt-2 max-w-md">
                        Try adjusting your filters or search for different
                        keywords.
                      </p>
                      <Button
                        onClick={handleResetFilters}
                        variant="outline"
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {filteredContests.length > 0 && !showBookmarked && !loading && (
              <div className="flex justify-center my-6 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {emailPopupOpen && (
          <div className="h-screen fixed inset-0 flex items-center justify-center bg-black/50 z-20 px-4">
            <Newsletter
              setEmailPopupOpen={setEmailPopupOpen}
              subscribeEmail={subscribeEmail}
            />
          </div>
        )}
      </div>

      <Footer subscribeEmail={subscribeEmail} />
    </div>
  );
};

export default Home;
