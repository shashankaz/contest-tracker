const TableLoadingSkeleton = () => {
  return (
    <div>
      <div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>

        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-12 bg-gray-200 dark:bg-gray-600 animate-pulse my-1"
            ></div>
          ))}
      </div>
    </div>
  );
};

export default TableLoadingSkeleton;
