# Contest Tracker Documentation

## Overview
Contest Tracker is an online tool designed to help users easily manage and keep track of coding contests. It allows users to view upcoming contests, bookmark them, and access solutions for questions from competitive programming platforms.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: Zustand
- **HTTP Client**: Axios
- **ODM (Object-Document Mapping)**: Mongoose
- **Utilities**: date-fns, clsx, slugify

## Application Features

### Routes
- `/`: Displays all available contests in a table format with pagination. Each contest entry includes a bookmark feature and a link to solutions.
- `/solution`: Lists all question-wise solutions. If a solution is unavailable, a form is provided to add solutions. Solutions are fetched from a YouTube playlist video description of respective platforms.

### Navbar Features
- Dropdown menu to filter contests by platform: LeetCode, CodeChef, Codeforces, or all contests.
- Bookmark toggle button to show or hide bookmarked contests.
- Theme switcher to toggle between light and dark modes.

### Responsive Design
The UI is fully responsive, ensuring a seamless user experience across desktop, tablet, and mobile devices.

## API Endpoints

### Contest Data Endpoints
- `GET /api/contest/{type}`: Retrieves contests based on the specified type (`all`, `leetcode`, `codechef`, or `codeforces`).

### Solution Data Endpoints
- `GET /api/solution`: Fetches stored solutions from MongoDB.
- `GET /api/solution/{title}`: Retrieves the solution for a given contest title. If not found, a form is displayed to submit a solution.

### Platform-Specific Endpoints
- `GET /api/codechef`: Lists YouTube playlist video metadata for CodeChef contests.
- `GET /api/codechef/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed.
- `GET /api/leetcode`: Lists YouTube playlist video metadata for LeetCode contests.
- `GET /api/leetcode/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed.
- `GET /api/codeforces`: Lists YouTube playlist video metadata for Codeforces contests.
- `GET /api/codeforces/{title}`: If the contest title is present in the playlist, it extracts the links from the YouTube video description and returns them. Otherwise, it checks `/api/solution/{title}` and if not found, a form is displayed.
