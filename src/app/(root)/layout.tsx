import Link from "next/link";
import axios from "axios";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/unique-users`
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-screen flex flex-col justify-between">
      {children}
      <div>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4 pt-4 text-sm md:text-base">
          <h4 className="font-medium">Total Visits</h4>
          <div>
            {response.data.userCount
              .toString()
              .split("")
              .map((item: number, idx: number) => {
                return (
                  <span
                    key={idx}
                    className="bg-gray-200 dark:bg-gray-800 py-1 md:py-2 px-2 md:px-3 rounded-sm mx-1 dark:text-white font-medium"
                  >
                    {item}
                  </span>
                );
              })}
          </div>
        </div>
        <p className="text-center py-4 text-sm md:text-base">
          Made with ❤️ by{" "}
          <Link
            href="https://x.com/shashankaz"
            target="_blank"
            className="hover:underline"
          >
            Shashank
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomeLayout;
