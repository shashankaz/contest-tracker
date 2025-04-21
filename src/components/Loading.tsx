const Loading = () => {
  return (
    <div>
      <div className="flex items-center justify-between h-20">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
        <div className="hidden md:flex items-center gap-3">
          <div className="h-10 w-60 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
        </div>
        <div className="flex md:hidden h-8 w-8 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-md"></div>
      </div>

      <div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-md mt-4"></div>

        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-8 bg-gray-200 dark:bg-gray-600 animate-pulse my-1 rounded-md"
            ></div>
          ))}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
};

export default Loading;
