import Link from "next/link";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-screen flex flex-col justify-between">
      {children}
      <p className="text-center py-4">
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
  );
};

export default HomeLayout;
