import { useCallback, useEffect, useRef, useState } from "react";

import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";

interface UseNewsletterYouRockProps {
  newsletterId: number;
  initialYouRocksCount?: number;
}

const MAX_PENDING_UPDATES = 50;
const DEBOUNCE_TIME = 800;

export function useNewsletterYouRock({
  newsletterId,
  initialYouRocksCount = 0,
}: UseNewsletterYouRockProps) {
  const { data: session } = useSession();
  const [youRocksCount, setYouRocksCount] = useState(initialYouRocksCount);
  const [isLoading, setIsLoading] = useState(false);
  const pendingUpdates = useRef<number>(0);
  const isMounted = useRef(true);
  const baseCount = useRef(initialYouRocksCount);

  const updateCount = async (incrementBy: number) => {
    if (incrementBy === 0) return;

    try {
      const response = await fetch("/api/newsletters/you-rock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterId, incrementBy }),
      });

      if (!response.ok) {
        throw new Error("Failed to update you rocks count");
      }

      const data = await response.json();
      if (isMounted.current) {
        baseCount.current = data.you_rocks_count;
        setYouRocksCount(data.you_rocks_count);
        pendingUpdates.current = 0;
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating you rocks count:", error);
      if (isMounted.current) {
        setYouRocksCount(baseCount.current);
        pendingUpdates.current = 0;
        setIsLoading(false);
      }
    }
  };

  const debouncedUpdateCount = useRef(
    debounce((incrementBy: number) => {
      updateCount(incrementBy);
    }, DEBOUNCE_TIME)
  ).current;

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (debouncedUpdateCount) {
        debouncedUpdateCount.cancel();
      }
      // Flush any pending updates
      if (pendingUpdates.current > 0) {
        updateCount(pendingUpdates.current);
      }
    };
  }, []);

  const addYouRock = useCallback(
    (incrementBy: number = 1) => {
      if (!session?.user) return;

      if (pendingUpdates.current >= MAX_PENDING_UPDATES) {
        console.warn("Maximum click limit reached");
        return;
      }

      pendingUpdates.current += incrementBy;
      setYouRocksCount(baseCount.current + pendingUpdates.current);
      debouncedUpdateCount(pendingUpdates.current);
    },
    [session?.user]
  );

  return {
    youRocksCount,
    isLoading,
    addYouRock,
  };
}
