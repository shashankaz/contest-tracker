"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  startTimeSeconds: number;
}

const Home = () => {
  const [codeforcesContest, setCodeforcesContest] = useState<
    CodeforcesContest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedContests, setBookmarkedContests] = useState<number[]>([]);
  const itemsPerPage = 10;

  const router = useRouter();

  const fetchCodeforcesContest = async () => {
    try {
      setLoading(true);
      const codeforcesResponse = await axios.get(
        "https://codeforces.com/api/contest.list"
      );
      setCodeforcesContest(codeforcesResponse.data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodeforcesContest();
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );
    setBookmarkedContests(savedBookmarks);
  }, []);

  const handleRedirect = (name: string) => {
    router.push(`/solution/?type=codeforces&name=${name}`);
  };

  const handleBookmark = (id: number) => {
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

  const paginatedContests = codeforcesContest.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <h1 className="text-3xl font-medium">Contest Tracker</h1>
        <ModeToggle />
      </div>

      <Table>
        <TableCaption>
          Contest List{" "}
          <span className="text-xs text-gray-500">
            (Last updated: {new Date().toLocaleString()})
          </span>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time remaining/passed</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedContests.map((contest) => {
            return (
              <TableRow
                key={contest.id}
                className={cn(
                  contest.phase === "BEFORE"
                    ? "bg-green-300 dark:bg-green-700"
                    : "bg-red-300 dark:bg-red-700"
                )}
              >
                <TableCell>{contest.type}</TableCell>
                <TableCell>{contest.id}</TableCell>
                <TableCell>{contest.name}</TableCell>
                <TableCell>
                  {fromUnixTime(contest.startTimeSeconds).toLocaleString()}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(fromUnixTime(contest.startTimeSeconds))}
                  {contest.phase === "BEFORE" ? " remaining" : " ago"}
                </TableCell>
                <TableCell className="flex gap-3 justify-center items-center bg-blue-300 dark:bg-blue-700 h-full">
                  <button
                    onClick={() => handleBookmark(contest.id)}
                    title="Bookmark contest"
                  >
                    {bookmarkedContests.includes(contest.id) ? (
                      <BookmarkCheck className="stroke-1" />
                    ) : (
                      <Bookmark className="stroke-1" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRedirect(contest.name)}
                    disabled={contest.phase === "BEFORE"}
                    className="hover:cursor-pointer disabled:hover:cursor-not-allowed"
                    title="View solution"
                  >
                    <ExternalLink className="stroke-1" />
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
          disabled={currentPage * itemsPerPage >= codeforcesContest.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
