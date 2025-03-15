import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SquareChevronRight } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

interface OverLayProps {
  setOpen: (value: boolean) => void;
  showBookmarked: boolean;
  setShowBookmarked: (value: boolean) => void;
}

const OverLay = ({
  setOpen,
  showBookmarked,
  setShowBookmarked,
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="codeforces">Codeforces</SelectItem>
              <SelectItem
                value="codechef"
                disabled
                className="flex items-center"
              >
                Codechef{" "}
                <span className="text-xs bg-green-500 rounded-full py-0.5 px-2">
                  Coming Soon!
                </span>
              </SelectItem>
              <SelectItem
                value="leetcode"
                disabled
                className="flex items-center"
              >
                Leetcode{" "}
                <span className="text-xs bg-green-500 rounded-full py-0.5 px-2">
                  Coming Soon!
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowBookmarked(!showBookmarked)}>
            {showBookmarked ? "Show All" : "Show Bookmarked"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverLay;
