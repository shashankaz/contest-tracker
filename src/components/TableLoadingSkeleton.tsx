const TableLoadingSkeleton = () => {
  return (
    <div>
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

export default TableLoadingSkeleton;
