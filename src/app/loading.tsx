import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/loading.svg"
        height={100}
        width={100}
        alt="Loading"
        className="dark:invert"
      />
      <h1 className="text-lg mt-3 font-medium text-center">
        Please wait, fetching contest details...
      </h1>
    </div>
  );
};

export default Loading;
