import Image from "next/image";
import { AUTHORS } from "@/lib/authors";

interface AuthorSectionProps {
  authorName?: string;
  date?: string;
  hideAuthor?: boolean;
  metadata?: {
    author: string;
    date: string;
    hideAuthor?: boolean;
  };
}

export function AuthorSection({ authorName, date, hideAuthor = false, metadata }: AuthorSectionProps) {
  
  // Check both explicit prop and metadata flag
  if (hideAuthor || metadata?.hideAuthor) return null;
  
  // Use props if provided, otherwise fall back to metadata
  const finalAuthorName = authorName || metadata?.author;
  const finalDate = date || metadata?.date;
  
  console.log('AuthorSection final values:', { finalAuthorName, finalDate });
  
  if (!finalAuthorName || !finalDate) {
    console.warn('AuthorSection: No author name or date provided via props or metadata');
    return null;
  }
  
  const author = AUTHORS[finalAuthorName];
  
  if (!author) {
    console.warn(`Author "${finalAuthorName}" not found in AUTHORS registry`);
    return null;
  }

  return (
    <div className="not-prose flex items-center gap-3 mt-1">
      <Image
        src={author.headshot}
        alt="Author headshot"
        className="h-7 w-7 rounded-full flex-shrink-0"
      />
      <span className="text-base leading-6">
        By {author.name} on {new Date(finalDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        })}
      </span>
    </div>
  );
}