import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, SquareChevronRight } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

interface OverLayProps {
  setOpen: (value: boolean) => void;
  showBookmarked: boolean;
  setShowBookmarked: (value: boolean) => void;
  platform: string;
  setPlatform: (value: "all" | "codeforces" | "codechef" | "leetcode") => void;
  liveUsers: number;
}

const OverLay = ({
  setOpen,
  showBookmarked,
  setShowBookmarked,
  platform,
  setPlatform,
  liveUsers,
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
          <Select
            value={platform}
            onValueChange={(
              value: "all" | "codeforces" | "codechef" | "leetcode"
            ) => setPlatform(value)}
          >
            <SelectTrigger className="w-full">
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
          <Button variant="secondary">
            <Eye /> {liveUsers}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverLay;
