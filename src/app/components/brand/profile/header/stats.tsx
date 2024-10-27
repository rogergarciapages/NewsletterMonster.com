import { AnimatePresence, motion } from "framer-motion";

interface StatsProps {
  newsletterCount: number;
  followersCount: number;
}

export default function Stats({ newsletterCount, followersCount }: StatsProps) {
  return (
    <div className="flex gap-6 mb-4">
      <div>
        <AnimatePresence mode="wait">
          <motion.span
            key={newsletterCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-semibold text-gray-800 dark:text-white"
          >
            {newsletterCount}
          </motion.span>
        </AnimatePresence>
        <span className="text-gray-800 dark:text-white/90 ml-1">
          newsletters
        </span>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.span
            key={followersCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-semibold text-gray-800 dark:text-white"
          >
            {followersCount}
          </motion.span>
        </AnimatePresence>
        <span className="text-gray-800 dark:text-white/90 ml-1">
          followers
        </span>
      </div>
    </div>
  );
}