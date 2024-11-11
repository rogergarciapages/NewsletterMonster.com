import { PropsWithChildren } from "react";

export default function TagLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
}
