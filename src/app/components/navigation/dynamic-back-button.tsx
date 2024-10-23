// components/navigation/dynamic-back-button.tsx
"use client";

import { Tooltip } from "@nextui-org/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DynamicBackButtonProps {
  brandname: string;
  brandDisplayName: string;
}

export default function DynamicBackButton({ brandname, brandDisplayName }: DynamicBackButtonProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previousPath, setPreviousPath] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("");

  useEffect(() => {
    // Get the previous path from sessionStorage
    const prevPath = sessionStorage.getItem("previousPath");
    
    if (prevPath) {
      setPreviousPath(prevPath);
      // Set button text based on previous path
      if (prevPath.includes("/popular")) {
        setButtonText("Popular Newsletters");
      } else if (prevPath.includes("/trending")) {
        setButtonText("Trending Newsletters");
      } else {
        setButtonText(`${brandDisplayName} Newsletters`);
      }
    } else {
      // If no previous path (direct access), default to brand page
      setPreviousPath(`/${brandname}`);
      setButtonText(`${brandDisplayName} Newsletters`);
    }
  }, [brandname, brandDisplayName]);

  const handleBack = () => {
    router.back();
  };

  const handleFallback = () => {
    // Only use push if we need to fallback to the brand page
    if (window.history.length <= 1) {
      router.push(`/${brandname}`);
    }
  };

  // Set up the fallback after component mounts
  useEffect(() => {
    handleFallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-4 mb-6">
      <Tooltip
        content={`Back to ${buttonText}`}
        placement="right"
        classNames={{
          content: [
            "py-2 px-4 shadow-xl",
            "text-white bg-zinc-800",
          ],
        }}
      >
        <button
          onClick={handleBack}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
          aria-label={`Back to ${buttonText}`}
        >
          <IconChevronLeft 
            size={20} 
            className="text-gray-900 transition-transform group-hover:-translate-x-0.5"
          />
        </button>
      </Tooltip>
      <span className="text-sm text-gray-600">{buttonText}</span>
    </div>
  );
}