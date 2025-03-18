import { NextResponse } from "next/server";
import axios from "axios";
import { format, addMinutes, addHours } from "date-fns";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
(async () => {
  await redis.connect();
})();

export const GET = async (req, { params }) => {
  let contests = [];

  const { type } = await params;

  try {
    const cacheKey = `contests_${type}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

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
          contest_date_start: contest.contest_start_date,
          contest_date_end: contest.contest_end_date,
          contest_origin: "codechef",
        });
      });

      response.data.future_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date_start: contest.contest_start_date,
          contest_date_end: contest.contest_end_date,
          contest_origin: "codechef",
        });
      });

      response.data.practice_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date_start: contest.contest_start_date,
          contest_date_end: contest.contest_end_date,
          contest_origin: "codechef",
        });
      });

      response.data.past_contests.forEach((contest) => {
        contests.push({
          contest_id: contest.contest_code,
          contest_name: contest.contest_name,
          contest_type: "CodeChef",
          contest_phase: contest.distinct_users,
          contest_date_start: contest.contest_start_date,
          contest_date_end: contest.contest_end_date,
          contest_origin: "codechef",
        });
      });

      // Total 1976 responses till 16/03/2025
      // for (let offset = 20; offset <= 100; offset += 20) {
      //   const responseOld = await axios.get(
      //     `https://www.codechef.com/api/list/contests/past?sort_by=START&sorting_order=desc&offset=${offset}&mode=all`
      //   );

      //   responseOld.data.contests.forEach((contest) => {
      //     contests.push({
      //       contest_id: contest.contest_code,
      //       contest_name: contest.contest_name,
      //       contest_type: "CodeChef",
      //       contest_phase: contest.distinct_users,
      //       contest_date_start: contest.contest_start_date,
      //       contest_date_end: contest.contest_end_date,
      //       contest_origin: "codechef",
      //     });
      //   });
      // }

      // Only fetching 200 contests for now + upcoming contests
      const offsets = Array.from({ length: 9 }, (_, i) => 20 + i * 20);
      const pastContestPromises = offsets.map((offset) =>
        axios.get(
          `https://www.codechef.com/api/list/contests/past?sort_by=START&sorting_order=desc&offset=${offset}&mode=all`
        )
      );

      const pastContestResponses = await Promise.all(pastContestPromises);

      pastContestResponses.forEach((responseOld) => {
        responseOld.data.contests.forEach((contest) => {
          contests.push({
            contest_id: contest.contest_code,
            contest_name: contest.contest_name,
            contest_type: "CodeChef",
            contest_phase: contest.distinct_users,
            contest_date_start: contest.contest_start_date,
            contest_date_end: contest.contest_end_date,
            contest_origin: "codechef",
          });
        });
      });
    };

    const fetchCodeforces = async () => {
      const response = await axios.get(
        "https://codeforces.com/api/contest.list"
      );

      response.data.result.forEach((contest) => {
        const adjustedStartTime = new Date(contest.startTimeSeconds * 1000);
        const adjustedEndTime = new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        );

        contests.push({
          contest_id: contest.id.toString(),
          contest_name: contest.name,
          contest_type: contest.type,
          contest_phase: contest.phase === "FINISHED" ? 1 : 0,
          contest_date_start: format(adjustedStartTime, "dd MMM yyyy HH:mm:ss"),
          contest_date_end: format(adjustedEndTime, "dd MMM yyyy HH:mm:ss"),
          contest_origin: "codeforces",
        });
      });
    };

    const fetchLeetcode = async () => {
      let skip = 0;
      const limit = 25;
      let totalResults = 0;

      do {
        const response = await axios.get(
          `https://lccn.lbao.site/api/v1/contests/?skip=${skip}&limit=${limit}`
        );

        totalResults = response.data.length;

        // Total 214 responses till 16/03/2025
        response.data.forEach((contest) => {
          const adjustedStartTime = addMinutes(
            addHours(new Date(contest.startTime), 5),
            30
          );
          const adjustedEndTime = addMinutes(
            addHours(new Date(contest.endTime), 5),
            30
          );
          contests.push({
            contest_id: contest._id,
            contest_name: contest.title,
            contest_type: "LeetCode",
            contest_phase: contest.past ? 1 : 0,
            contest_date_start: format(
              adjustedStartTime,
              "dd MMM yyyy HH:mm:ss"
            ),
            contest_date_end: format(adjustedEndTime, "dd MMM yyyy HH:mm:ss"),
            contest_origin: "leetcode",
          });
        });

        skip += limit;
      } while (totalResults === limit);
    };

    const fetchAll = async () => {
      const promises = [];
      if (type === "codechef" || type === "all") {
        promises.push(fetchCodechef());
      }
      if (type === "codeforces" || type === "all") {
        promises.push(fetchCodeforces());
      }
      if (type === "leetcode" || type === "all") {
        promises.push(fetchLeetcode());
      }
      await Promise.all(promises);
    };

    await fetchAll();

    contests.sort(
      (a, b) => new Date(b.contest_date_start) - new Date(a.contest_date_start)
    );

    await redis.set(cacheKey, JSON.stringify(contests), {
      EX: 900,
    });

    return NextResponse.json(contests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
