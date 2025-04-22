import { create } from "zustand";

interface PlatformState {
  platform: "" | "codeforces" | "codechef" | "leetcode" | "geeksforgeeks";
  setPlatform: (
    newPlatform: "" | "codeforces" | "codechef" | "leetcode" | "geeksforgeeks"
  ) => void;
}

export const usePlatform = create<PlatformState>((set) => ({
  platform: "",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));
