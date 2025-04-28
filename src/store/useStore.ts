import { create } from "zustand";

interface PlatformState {
  platform:
    | ""
    | "codeforces"
    | "codechef"
    | "leetcode"
    | "geeksforgeeks"
    | "atcoder";
  setPlatform: (
    newPlatform:
      | ""
      | "codeforces"
      | "codechef"
      | "leetcode"
      | "geeksforgeeks"
      | "atcoder"
  ) => void;
}

interface LiveUsers {
  liveUsers: number;
  setLiveUsers: (count: number) => void;
}

interface Open {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface User {
  user: {
    _id: string;
    token: string;
    name: string;
    username: string;
    email: string;
  };
  setUser: (user: User["user"]) => void;
}

export const usePlatform = create<PlatformState>((set) => ({
  platform: "",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));

export const useLiveUsers = create<LiveUsers>((set) => ({
  liveUsers: 0,
  setLiveUsers: (count) => set({ liveUsers: count }),
}));

export const useOpen = create<Open>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export const useUser = create<User>((set) => ({
  user: {
    _id: "",
    token: "",
    name: "",
    username: "",
    email: "",
  },
  setUser: (user) => set({ user }),
}));
