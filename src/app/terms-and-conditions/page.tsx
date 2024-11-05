// src/app/terms-and-conditions/page.tsx
import { Metadata } from "next";

import { promises as fs } from "fs";
import { marked } from "marked";
import path from "path";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for our website",
  robots: "nofollow",
};

export default async function TermsPage() {
  // Updated path to match your file structure
  const markdown = await fs.readFile(
    path.join(process.cwd(), "src", "app", "content", "terms.md"),
    "utf-8"
  );

  // Convert markdown to HTML
  const htmlContent = marked(markdown);

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose prose-slate mx-auto max-w-prose">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </main>
  );
}
