# Contest Tracker Documentation

## Overview
Contest Tracker is an online tool designed to help users easily manage and keep track of coding contests. It allows users to view upcoming and past contests, bookmark them, and access solutions for questions from competitive programming platforms.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: Zustand
- **HTTP Client**: Axios
- **ODM (Object-Document Mapping)**: Mongoose
- **Utilities**: date-fns, clsx
- **Cache**: Redis, localStorage

## Application Features

### Routes
- `/`: Displays all available contests (both upcoming and past) in a table format with pagination. Each contest entry includes the following columns:
  - **Type/Platform**: The platform of the contest (e.g., LeetCode, CodeChef, Codeforces). A live mark is shown beside the type/platform for any live contest.
  - **Contest Name**: The name of the contest.
  - **Start Date & Time**: The start date and time of the contest.
  - **Duration**: The duration of the contest.
  - **End Date & Time**: The end date and time of the contest.
  - **Time remaining/passed**: The time remaining before the contest starts or the time passed since it ended.
  - **Save**: A bookmark feature to save the contest.
  - **Solution**: A link to the solutions for the contest. The YouTube solution video is also embedded with the solution links.

- `/solution/?type=${platform}&name=${contestName}&id=${contestId}`: Lists all question-wise solutions. If a solution is unavailable, a form is provided to add solutions. Solutions are fetched from a YouTube playlist video description of respective platforms, and if auto-fetching fails, a team member can manually attach the corresponding link.

### Navbar Features
- Dropdown menu to filter contests by platform: LeetCode, CodeChef, Codeforces, or all contests.
- Bookmark toggle button to show or hide bookmarked contests.
- Theme switcher to toggle between light and dark modes.

### Responsive Design
The UI is fully responsive, ensuring a seamless user experience across desktop, tablet, and mobile devices.

### Caching
- Redis is used to cache frequently accessed contest lists, improving performance and reducing database load by minimizing the number of queries.
- localStorage is used on the client side to cache contest data, reducing the need for repeated API calls and improving performance.

## API Endpoints

### Contest Data Endpoints
- `GET /api/contest/{type}`: Retrieves contests based on the specified type (`all`, `leetcode`, `codechef`, `codeforces`, `past`).

### Solution Data Endpoints
- `GET /api/solution`: Fetches stored solutions from MongoDB.
- `GET /api/solution/{title}`: Retrieves the solution for a given contest title. If not found, a form is displayed to submit a solution.

### Platform-Specific Endpoints
- `GET /api/codechef`: Lists YouTube playlist video metadata for CodeChef contests.
- `GET /api/codechef/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed where a team member can manually attach the solution link.
- `GET /api/leetcode`: Lists YouTube playlist video metadata for LeetCode contests.
- `GET /api/leetcode/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed where a team member can manually attach the solution link.
- `GET /api/codeforces`: Lists YouTube playlist video metadata for Codeforces contests.
- `GET /api/codeforces/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed where a team member can manually attach the solution link.