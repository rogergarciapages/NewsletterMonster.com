import { Metadata } from "next";
import { promises as fs } from "fs";
import { marked } from "marked";
import path from "path";

export const metadata: Metadata = {
  title: "Privacy Policy | Newsletterzilla",
  description: "Privacy Policy for Newsletterzilla.com",
};

export default async function PrivacyPage() {
  const markdown = await fs.readFile(
    path.join(process.cwd(), "src", "app", "content", "privacy.md"),
    "utf-8"
  );

  const htmlContent = marked(markdown);

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose prose-slate mx-auto max-w-prose dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </main>
  );
}
