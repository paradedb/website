interface TitleProps {
  children?: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
  metadata?: {
    title?: string;
    hideTitle?: boolean;
  };
}

export function Title({
  children,
  className = "text-2xl md:text-3xl font-bold normal-case tracking-tight text-slate-900 dark:text-white scroll-mt-36 md:scroll-mt-24",
  hideTitle = false,
  metadata,
}: TitleProps) {
  // Check both explicit prop and metadata flag
  if (hideTitle || metadata?.hideTitle) return null;

  // Use explicit children if provided, otherwise use metadata title
  const titleContent = children || metadata?.title;

  if (!titleContent) {
    return null;
  }

  return <h1 className={className}>{titleContent}</h1>;
}
