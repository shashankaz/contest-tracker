import { create } from "zustand";

interface PlatformState {
  platform: "" | "codeforces" | "codechef" | "leetcode";
  setPlatform: (
    newPlatform: "" | "codeforces" | "codechef" | "leetcode"
  ) => void;
}

export const usePlatform = create<PlatformState>((set) => ({
  platform: "",
  setPlatform: (newPlatform) => set({ platform: newPlatform }),
}));
