"use client";

import { useEffect } from "react";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="max-w-md border-none bg-background/60 dark:bg-default-100/50">
        <CardHeader className="flex flex-col gap-3 text-center">
          <div className="flex items-center justify-center">
            <span className="text-5xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
        </CardHeader>
        <CardBody className="text-center">
          <p className="mb-6 text-default-500">We encountered an error while loading this page.</p>
          <Button color="warning" variant="shadow" onClick={reset} className="font-medium">
            Try again
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
