import Image from "next/image";

const LoadingNew = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 h-screen flex items-center justify-center">
      <Image
        src="loadingicon.svg"
        alt="Loading"
        width={100}
        height={100}
        className="dark:invert"
      />
    </div>
  );
};

export default LoadingNew;
