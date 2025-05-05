"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { Bookmark, BookmarkCheck, ExternalLink, Search } from "lucide-react";
import { addHours, addMinutes, formatDistanceToNow } from "date-fns";
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

        <h2 className="text-4xl md:text-6xl font-medium py-16 md:py-20 text-center">
          Upcoming Contests
        </h2>

        <Table className="border mt-6">
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
              <TableHead>Time remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingContest.map((contest) => {
              return (
                <TableRow key={contest.contest_id}>
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
                    {getLiveContest(contest) && (
                      <span className="text-xs uppercase bg-white text-red-500 border border-red-500 px-3 py-0.5 mr-3 rounded-2xl font-medium">
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
                  <TableCell>{getTimeRemaining(contest)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <h2 className="text-4xl md:text-6xl font-medium py-16 md:py-20 text-center">
          Past Contests
        </h2>

        <div className="hidden md:flex items-center justify-end gap-3 py-6">
          <Button variant="secondary" onClick={handleResetFilters}>
            Reset Filters
          </Button>
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

        {loading ? (
          <TableLoadingSkeleton />
        ) : filteredContests.length > 0 ? (
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Type/Platform</TableHead>
                <TableHead>Contest Name</TableHead>
                <TableHead>Start Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>End Date & Time</TableHead>
                <TableHead>Time passed</TableHead>
                <TableHead className="text-center">Save</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContests.map((contest) => {
                return (
                  <TableRow key={contest.contest_id}>
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
                      {getLiveContest(contest) && (
                        <span className="text-xs uppercase bg-white text-red-500 border border-red-500 px-3 py-0.5 mr-3 rounded-2xl font-medium">
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
                    <TableCell>{getTimeRemaining(contest)}</TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleBookmark(contest)}
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
                No saved contests found.
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
