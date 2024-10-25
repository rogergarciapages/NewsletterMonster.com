interface StatsProps {
    newsletterCount: number;
    followersCount: number;
  }
  
  export default function Stats({ newsletterCount, followersCount }: StatsProps) {
    return (
      <div className="flex gap-6 mb-4">
        <div>
          <span className="font-semibold text-gray-800 dark:text-white">
            {newsletterCount}
          </span>
          <span className="text-gray-800 dark:text-white/90 ml-1">
            newsletters
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-800 dark:text-white">
            {followersCount}
          </span>
          <span className="text-gray-800 dark:text-white/90 ml-1">
            followers
          </span>
        </div>
      </div>
    );
  }