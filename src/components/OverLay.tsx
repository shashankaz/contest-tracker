import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, SquareChevronRight } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface OverLayProps {
  setOpen: (value: boolean) => void;
  showBookmarked: boolean;
  setShowBookmarked: (value: boolean) => void;
  platform: string;
  setPlatform: (
    value: "" | "codeforces" | "codechef" | "leetcode" | "geeksforgeeks"
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
  return (
    <div className="fixed inset-0 flex">
      <div className="w-2/5" onClick={() => setOpen(false)}></div>
      <div className="w-3/5 bg-white dark:bg-black h-screen ml-auto px-4">
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
            ) => setPlatform(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="codeforces">Codeforces</SelectItem>
              <SelectItem value="codechef">Codechef</SelectItem>
              <SelectItem value="leetcode">Leetcode</SelectItem>
              <SelectItem value="geeksforgeeks">GeeksforGeeks</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowBookmarked(!showBookmarked)}>
            {showBookmarked ? "Show All" : "Show Bookmarked"}
          </Button>
          <Button variant="secondary">
            <Eye /> {liveUsers}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverLay;
