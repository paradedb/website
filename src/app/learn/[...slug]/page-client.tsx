"use client";

interface LearnPageClientProps {
  slug: string;
}

export function LearnPageClient({ slug }: LearnPageClientProps) {
  return (
    <div>
      <h1>Learn: {slug}</h1>
      <p>Content coming soon...</p>
    </div>
  );
}