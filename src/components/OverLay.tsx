import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Eye,
  Search,
  SquareChevronRight,
  User,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./theme-toggle";
import { useUser } from "@/context/userContest";

interface OverLayProps {
  setOpen: (value: boolean) => void;
  showBookmarked: boolean;
  setShowBookmarked: (value: boolean) => void;
  platform: string;
  setPlatform: (
    value:
      | ""
      | "codeforces"
      | "codechef"
      | "leetcode"
      | "geeksforgeeks"
      | "atcoder"
  ) => void;
  liveUsers: number;
  search: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OverLay = ({
  setOpen,
  showBookmarked,
  setShowBookmarked,
  platform,
  setPlatform,
  liveUsers,
  search,
  handleSearchChange,
}: OverLayProps) => {
  const { user, token } = useUser();

  return (
    <div className="fixed inset-0 flex">
      <div className="w-1/3" onClick={() => setOpen(false)}></div>
      <div className="w-2/3 bg-white dark:bg-black h-screen ml-auto px-4">
        <div className="h-20 flex items-center justify-between">
          <button onClick={() => setOpen(false)}>
            <SquareChevronRight />
          </button>
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              placeholder="Search Contest"
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
            <Search className="size-4 absolute top-1/2 -translate-1/2 left-5 text-gray-400" />
          </div>
          <Select
            value={platform}
            onValueChange={(
              value:
                | ""
                | "codeforces"
                | "codechef"
                | "leetcode"
                | "geeksforgeeks"
                | "atcoder"
            ) => setPlatform(value)}
          >
            <SelectTrigger className="w-full">
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
          <Button onClick={() => setShowBookmarked(!showBookmarked)}>
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
          <Button variant="secondary" title="Live users">
            <Eye /> {liveUsers} LIVE
          </Button>
          {!token && !user && (
            <Link href="/login">
              <Button className="w-full">Login</Button>
            </Link>
          )}
          {token && user && (
            <Link href="/profile">
              <Button className="w-full">
                <User className="size-4" />
                Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverLay;
