// Create new file: src/app/components/brand/profile/header/loading.tsx
export default function Loading() {
    return (
      <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-grow">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }