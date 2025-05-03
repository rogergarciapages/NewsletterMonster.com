import React from "react";

interface AdvertisementBannerProps {
  tall?: boolean;
}

const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ tall = false }) => {
  const height = tall ? 400 : 208;
  return (
    <div
      className={`relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 shadow-sm dark:bg-zinc-800 ${tall ? "h-[400px]" : "h-[208px]"}`}
      style={{ minHeight: height }}
    >
      <span className="absolute left-2 top-2 rounded bg-white/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-zinc-900/80 dark:text-gray-400">
        Advertisement
      </span>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div
          className={`mb-2 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700 ${tall ? "h-16 w-16" : "h-12 w-12"}`}
        >
          <svg
            width={tall ? 48 : 32}
            height={tall ? 48 : 32}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-400 dark:text-gray-500"
          >
            <rect x="4" y="7" width="16" height="10" rx="2" strokeWidth="1.5" />
            <path d="M4 15l4-4a2 2 0 0 1 2.8 0l4.2 4.2" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1" />
          </svg>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Your ad could be here</span>
        <span className="mt-1 text-xs text-gray-400">100% × {height} px</span>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
