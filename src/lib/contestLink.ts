export const contestLink = (platform: string, contest_id: string) => {
  switch (platform) {
    case "codeforces":
      return `https://codeforces.com/contests/${contest_id}`;
    case "codechef":
      return `https://www.codechef.com/${contest_id}`;
    case "leetcode":
      return `https://leetcode.com/contest/${contest_id}`;
    case "geeksforgeeks":
      return `https://practice.geeksforgeeks.org/contest/${contest_id}`;
    case "atcoder":
      return `https://atcoder.jp/contests/${contest_id}`;
    default:
      return "";
  }
};
