"use client";

import { memo, useState } from "react";

import { BiSolidBulb, BiSolidTag } from "react-icons/bi";

interface KeyInsightsProps {
  insights: string[] | undefined | null;
}

export const KeyInsights = memo(({ insights }: KeyInsightsProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!insights || !insights.length) {
    return null;
  }

  const validInsights = insights.filter(insight => {
    if (
      typeof insight === "string" &&
      (insight.includes("<") ||
        insight.includes(">") ||
        insight.toLowerCase().includes("<!doctype") ||
        insight.toLowerCase().includes("</") ||
        insight.toLowerCase().includes("xml"))
    ) {
      return false;
    }

    if (typeof insight === "string" && insight.length > 300) {
      return false;
    }

    if (typeof insight !== "string" || insight.trim() === "") {
      return false;
    }

    return true;
  });

  if (validInsights.length === 0) {
    return null;
  }

  const initialInsightsCount = 3;
  const displayedInsights = showAll ? validInsights : validInsights.slice(0, initialInsightsCount);
  const hiddenCount = validInsights.length - initialInsightsCount;

  return (
    <div className="rounded-lg bg-gray-50 p-6 dark:bg-zinc-800">
      <div className="mb-4 flex items-center">
        <BiSolidBulb className="mr-2 h-6 w-6 text-amber-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Key Insights</h2>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Important takeaways from this newsletter
      </p>
      <ul className="space-y-3">
        {displayedInsights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <BiSolidTag className="mr-2 mt-1 h-4 w-4 text-amber-400" />
            <span className="text-gray-700 dark:text-gray-300">{insight}</span>
          </li>
        ))}
      </ul>

      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 flex items-center text-sm text-amber-400 hover:text-amber-300"
        >
          Show {hiddenCount} more insights <span className="ml-1">↓</span>
        </button>
      )}

      {showAll && validInsights.length > initialInsightsCount && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 flex items-center text-sm text-amber-400 hover:text-amber-300"
        >
          Hide insights <span className="ml-1">↑</span>
        </button>
      )}
    </div>
  );
});

KeyInsights.displayName = "KeyInsights";
