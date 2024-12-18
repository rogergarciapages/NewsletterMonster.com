"use client";

import Link from "next/link";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="max-w-md border-none bg-background/60 dark:bg-default-100/50">
        <CardHeader className="flex flex-col gap-3 text-center">
          <div className="flex items-center justify-center">
            <span className="text-5xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold">Brand Not Found</h2>
        </CardHeader>
        <CardBody className="text-center">
          <p className="mb-6 text-default-500">
            The brand you're looking for doesn't exist or has been removed.
          </p>
          <Button as={Link} href="/" color="primary" variant="shadow" className="font-medium">
            Return Home
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
