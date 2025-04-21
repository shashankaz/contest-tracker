import { create } from "zustand";

interface PlatformState {
  platform: "" | "codeforces" | "codechef" | "leetcode" | "geekforgeeks";
  setPlatform: (
    newPlatform: "" | "codeforces" | "codechef" | "leetcode" | "geekforgeeks"
  ) => void;
}

export const usePlatform = create<PlatformState>((set) => ({
  platform: "",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));
