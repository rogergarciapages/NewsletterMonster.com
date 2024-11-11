function getRandomWidth(): number {
  const minWidth = 48;
  const maxWidth = 96;
  return Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
}

export default function PopularTagsLoading() {
  const itemCount = Math.floor(Math.random() * 5) + 8;

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: itemCount }).map((_, i) => {
        const width = getRandomWidth();
        return (
          <div
            key={i}
            style={{ width: `${width}px` }}
            className="h-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
          />
        );
      })}
    </div>
  );
}
