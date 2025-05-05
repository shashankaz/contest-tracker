import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      <Navbar />
      <div className="h-20 flex items-center">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">
          About Us
        </h1>
      </div>
      <div className="space-y-3">
        <p>
          Contest Tracker is a centralized platform designed to keep competitive
          programmers in sync with upcoming contests from major platforms like
          Codeforces, LeetCode, CodeChef, AtCoder, and GeeksforGeeks. We bring
          all contest data into a unified, easy-to-navigate system with advanced
          filtering, search, and real-time updates—making it simpler than ever
          to plan your coding journey.
        </p>
        <p>
          Our backend is built for reliability and performance, with automated
          contest aggregation, intelligent scheduling, and real-time
          notifications. Whether you&apos;re tracking your favorite platforms,
          subscribing to timely email reminders, or viewing contest changes
          live, our system ensures you have the latest information at your
          fingertips. We also provide robust user features including secure
          authentication, personalized profiles, and platform preferences.
        </p>
        <p>
          Behind the scenes, Contest Tracker is powered by a modern tech stack
          featuring Node.js, TypeScript, MongoDB, and Redis. We prioritize
          security, system health, and user experience—offering features like
          retry management, email logging, and admin alerts. Whether you&apos;re
          just starting or already a seasoned coder, Contest Tracker helps you
          stay competitive, consistent, and contest-ready.
        </p>
      </div>
    </div>
  );
};

export default About;
