"use client";

import { useState } from "react";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { IconBulb, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface KeyInsightsProps {
  insights: string | null;
  className?: string;
}

export default function KeyInsights({ insights, className = "" }: KeyInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no insights provided, don't render anything
  if (!insights) return null;

  // Don't render if insights contains HTML-like content
  const lowerCaseInsights = insights.trim().toLowerCase();
  if (
    lowerCaseInsights.startsWith("<!doctype") ||
    lowerCaseInsights.startsWith("<html") ||
    lowerCaseInsights.includes("<head") ||
    lowerCaseInsights.includes("<body") ||
    lowerCaseInsights.includes("<meta") ||
    lowerCaseInsights.includes("<title") ||
    lowerCaseInsights.includes("<style") ||
    lowerCaseInsights.includes("<script") ||
    lowerCaseInsights.includes("<link") ||
    lowerCaseInsights.includes("content=") ||
    lowerCaseInsights.includes("charset=") ||
    // Count the number of < characters - if too many, likely HTML
    (insights.match(/</g) || []).length > 5
  ) {
    return null;
  }

  // For comma-separated insights, split by commas
  const parsedInsights: string[] = insights
    .split(",")
    .map(item => item.trim())
    .filter(item => {
      // Skip empty items
      if (item.length === 0) return false;

      // Skip items that look like HTML tags or contain HTML tags
      if (
        item.startsWith("<") ||
        item.endsWith(">") ||
        item.includes("</") ||
        item.includes("/>") ||
        item.includes("<!") ||
        // Check for HTML tag pattern like <tag>
        /(<([^>]+)>)/i.test(item)
      ) {
        return false;
      }

      return true;
    });

  // If we have no valid insights after parsing, don't render
  if (parsedInsights.length === 0) return null;

  // Only show first 3 insights if not expanded
  const displayedInsights = isExpanded ? parsedInsights : parsedInsights.slice(0, 3);
  const hasMoreInsights = parsedInsights.length > 3;

  return (
    <Card className={`mb-6 bg-zinc-900/60 ${className}`}>
      <CardHeader className="flex gap-3 px-6 pb-2 pt-6">
        <IconBulb className="h-6 w-6 text-warning" />
        <div className="flex flex-col">
          <h2 className="m-0 text-xl font-semibold text-gray-200">Key Insights</h2>
          <p className="text-sm text-gray-400">Important takeaways from this newsletter</p>
        </div>
      </CardHeader>
      <Divider className="my-2" />
      <CardBody className="px-6 py-4">
        <ul className="ml-2 list-disc space-y-3 pl-4">
          {displayedInsights.map((insight, index) => (
            <li key={index} className="text-gray-300">
              {insight}
            </li>
          ))}
        </ul>

        {hasMoreInsights && (
          <Button
            variant="light"
            className="mt-4 w-full text-warning"
            endContent={isExpanded ? <IconChevronUp /> : <IconChevronDown />}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : `Show ${parsedInsights.length - 3} more insights`}
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
