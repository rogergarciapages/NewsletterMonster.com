import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Base directory for content
const contentDirectory = path.join(process.cwd(), "content");

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  return {
    title: `Diagnostic | ${params.category}/${params.slug}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  try {
    console.log(`Diagnostic page for ${params.category}/${params.slug}`);

    // Direct file system check
    const categoryDir = path.join(contentDirectory, "blog", params.category);
    let categoryExists = false;
    let files: string[] = [];
    let matchingFile = null;
    let frontMatter = null;

    try {
      categoryExists = fs.existsSync(categoryDir);
      if (categoryExists) {
        files = fs.readdirSync(categoryDir).filter(f => f.endsWith(".mdx"));

        // Look for a matching file
        for (const file of files) {
          const filePath = path.join(categoryDir, file);
          const content = fs.readFileSync(filePath, "utf8");
          const { data } = matter(content);

          if (data.slug === params.slug || file.replace(/\.mdx$/, "") === params.slug) {
            matchingFile = file;
            frontMatter = data;
            break;
          }
        }
      }
    } catch (fsError) {
      console.error("File system error:", fsError);
    }

    // Return diagnostic HTML
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Diagnostic Information</h1>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Request Parameters</h2>
          <p>
            <strong>Category:</strong> {params.category}
          </p>
          <p>
            <strong>Slug:</strong> {params.slug}
          </p>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Category Directory</h2>
          <p>
            <strong>Path:</strong> {categoryDir}
          </p>
          <p>
            <strong>Directory exists:</strong> {categoryExists ? "Yes" : "No"}
          </p>
          {categoryExists && (
            <>
              <p>
                <strong>Files found:</strong> {files.length}
              </p>
              <ul style={{ marginTop: "0.5rem", listStyleType: "disc", paddingLeft: "1.5rem" }}>
                {files.map(file => (
                  <li key={file} style={{ fontWeight: file === matchingFile ? "bold" : "normal" }}>
                    {file} {file === matchingFile ? "(MATCH)" : ""}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {matchingFile ? (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Matching File Found</h2>
            <p>
              <strong>Filename:</strong> {matchingFile}
            </p>
            <p>
              <strong>Title:</strong> {frontMatter?.title || "No title found"}
            </p>
            <p>
              <strong>Slug in frontmatter:</strong> {frontMatter?.slug || "No slug in frontmatter"}
            </p>
            <pre
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#f5f5f5",
                overflow: "auto",
              }}
            >
              {JSON.stringify(frontMatter, null, 2)}
            </pre>
          </div>
        ) : (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              border: "1px solid #f88",
              backgroundColor: "#fff5f5",
              borderRadius: "0.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#c00" }}>
              No Matching File Found
            </h2>
            <p>Could not find a file matching slug: {params.slug}</p>
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <a
            href={`/blog/${params.category}`}
            style={{ color: "#0066cc", textDecoration: "underline" }}
          >
            Return to Category Page
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in diagnostic page:", error);

    // Return error details
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#c00" }}>Error Occurred</h1>
        <p style={{ marginTop: "1rem" }}>
          <strong>Error:</strong> {error instanceof Error ? error.message : "Unknown error"}
        </p>
        {error instanceof Error && error.stack && (
          <pre
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              overflow: "auto",
              fontSize: "0.875rem",
            }}
          >
            {error.stack}
          </pre>
        )}
        <div style={{ marginTop: "2rem" }}>
          <a href="/blog" style={{ color: "#0066cc", textDecoration: "underline" }}>
            Return to Blog
          </a>
        </div>
      </div>
    );
  }
}
