import { NextResponse } from "next/server";
import axios from "axios";
import { format, formatDistanceToNow, fromUnixTime } from "date-fns";

export const GET = async (req, { params }) => {
  let contests = [];

  const { type } = await params;

  try {
    const fetchCodechef = async () => {
      const response = await axios.get(
        "https://www.codechef.com/api/list/contests/all"
      );

      response.data.present_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date: contest.contest_start_date,
          contest_startTime: formatDistanceToNow(
            contest.contest_start_date_iso
          ),
          contest_origin: "codechef",
        });
      });

      response.data.future_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date: contest.contest_start_date,
          contest_startTime: formatDistanceToNow(
            contest.contest_start_date_iso
          ),
          contest_origin: "codechef",
        });
      });

      response.data.practice_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date: contest.contest_start_date,
          contest_startTime: formatDistanceToNow(
            contest.contest_start_date_iso
          ),
          contest_origin: "codechef",
        });
      });

      response.data.past_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date: contest.contest_start_date,
          contest_startTime: formatDistanceToNow(
            contest.contest_start_date_iso
          ),
          contest_origin: "codechef",
        });
      });
    };

    const fetchCodeforces = async () => {
      const response = await axios.get(
        "https://codeforces.com/api/contest.list"
      );

      response.data.result.forEach((contest) => {
        contests.push({
          contest_id: contest.id.toString(),
          contest_name: contest.name,
          contest_type: contest.type,
          contest_phase: contest.phase === "FINISHED" ? 1 : 0,
          contest_date: format(
            new Date(contest.startTimeSeconds * 1000),
            "dd MMM yyyy HH:mm:ss"
          ),
          contest_startTime: formatDistanceToNow(
            fromUnixTime(contest.startTimeSeconds)
          ),
          contest_origin: "codeforces",
        });
      });
    };

    if (type === "codechef") {
      await fetchCodechef();
    } else if (type === "codeforces") {
      await fetchCodeforces();
    } else if (type === "leetcode") {
      await fetchCodeforces();
    } else if (type === "all") {
      await fetchCodechef();
      await fetchCodeforces();
    }

    contests.sort(
      (a, b) => new Date(b.contest_date) - new Date(a.contest_date)
    );

    return NextResponse.json(contests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
