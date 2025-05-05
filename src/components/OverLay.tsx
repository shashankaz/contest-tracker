import Link from "next/link";
import { Eye, SquareChevronRight, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggle";
import { useUser } from "@/context/userContest";

interface OverLayProps {
  setOpen: (value: boolean) => void;
  liveUsers: number;
}

const OverLay = ({ setOpen, liveUsers }: OverLayProps) => {
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
        <div className="grid grid-cols-2 gap-4">
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
