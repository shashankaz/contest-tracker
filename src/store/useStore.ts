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

export const usePlatform = create<PlatformState>((set) => ({
  platform: "",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));
