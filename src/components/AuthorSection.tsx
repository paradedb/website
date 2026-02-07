import Image from "next/image";
import { AUTHORS } from "@/lib/authors";

interface AuthorSectionProps {
  authorName?: string | string[];
  date?: string;
  hideAuthor?: boolean;
  metadata?: {
    author: string | string[];
    date: string;
    hideAuthor?: boolean;
  };
}

export function AuthorSection({
  authorName,
  date,
  hideAuthor = false,
  metadata,
}: AuthorSectionProps) {
  // Check both explicit prop and metadata flag
  if (hideAuthor || metadata?.hideAuthor) return null;

  // Use props if provided, otherwise fall back to metadata
  const finalAuthorName = authorName || metadata?.author;
  const finalDate = date || metadata?.date;

  if (!finalAuthorName || !finalDate) {
    return null;
  }

  // Handle both single author and multiple authors
  const authorNames = Array.isArray(finalAuthorName)
    ? finalAuthorName
    : [finalAuthorName];

  // Get author info for each author
  const authors = authorNames.map(
    (name) =>
      AUTHORS[name] || {
        name: name,
        headshot: null, // No headshot - will use fallback
      },
  );

  // Filter to only authors with headshots
  const authorsWithHeadshots = authors.filter((author) => author.headshot);
  const authorsWithoutHeadshots = authors.length - authorsWithHeadshots.length;

  // Format author names for display
  const formatAuthorNames = (
    authorList: { name: string; headshot: unknown }[],
  ) => {
    if (authorList.length === 1) {
      return authorList[0].name;
    } else if (authorList.length === 2) {
      return `${authorList[0].name} and ${authorList[1].name}`;
    } else {
      const allButLast = authorList
        .slice(0, -1)
        .map((a) => a.name)
        .join(", ");
      const last = authorList[authorList.length - 1].name;
      return `${allButLast}, and ${last}`;
    }
  };

  return (
    <div className="not-prose flex items-center gap-3 mt-1">
      {/* Show avatars only for authors with headshots, plus overflow indicator */}
      <div className="flex -space-x-1">
        {authorsWithHeadshots.slice(0, 3).map((author, index) => (
          <div
            key={author.name}
            className="relative"
            style={{ zIndex: 10 - index }}
          >
            <Image
              src={author.headshot}
              alt={`${author.name} headshot`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full flex-shrink-0 border-2 border-white dark:border-slate-950"
            />
          </div>
        ))}
        {(authorsWithHeadshots.length > 3 || authorsWithoutHeadshots > 0) && (
          <div className="h-7 w-7 rounded-full bg-purple-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs text-white font-semibold">
            +
            {(authorsWithHeadshots.length > 3
              ? authorsWithHeadshots.length - 3
              : 0) + authorsWithoutHeadshots}
          </div>
        )}
      </div>
      <span className="text-base leading-6 text-slate-900 dark:text-slate-300">
        By {formatAuthorNames(authors)} on{" "}
        {new Date(finalDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>
  );
}
