import { create } from "zustand";

interface PlatformState {
  platform: "all" | "codeforces" | "codechef" | "leetcode";
  setPlatform: (
    newPlatform: "all" | "codeforces" | "codechef" | "leetcode"
  ) => void;
}

export const usePlatform = create<PlatformState>((set) => ({
  platform: "all",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));
