"use client";

import { useState } from "react";

interface KeyInsightsProps {
  insights: string | null;
}

export function KeyInsights({ insights }: KeyInsightsProps) {
  const [showAll, setShowAll] = useState(false);

  if (!insights) return null;

  const insightsList = insights
    .split(",")
    .filter(insight => insight.trim())
    .map(insight => insight.trim().replace(/^[-•*]\s*/, ""));

  const visibleInsights = showAll ? insightsList : insightsList.slice(0, 3);
  const hasMore = insightsList.length > 3;

  return (
    <div className="mb-8 rounded-xl bg-zinc-800/50 p-8">
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-2 text-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-200">Key Insights</h2>
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-400">Important takeaways from this newsletter</p>
      <div className="text-gray-300">
        {visibleInsights.map((insight, index) => (
          <div key={index} className="flex items-start py-1">
            <span className="mr-2">•</span>
            <p>{insight}</p>
          </div>
        ))}

        {hasMore && (
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-end text-sm text-amber-400"
            >
              {showAll ? (
                <>
                  Show less
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </>
              ) : (
                <>
                  Show {insightsList.length - 3} more insights
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
