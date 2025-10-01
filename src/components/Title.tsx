interface TitleProps {
  children?: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
  metadata?: {
    title?: string;
    hideTitle?: boolean;
  };
}

export function Title({ children, className = "text-2xl font-bold normal-case tracking-tight text-gray-900 scroll-mt-36 md:scroll-mt-24", hideTitle = false, metadata }: TitleProps) {
  
  // Check both explicit prop and metadata flag
  if (hideTitle || metadata?.hideTitle) return null;
  
  // Use explicit children if provided, otherwise use metadata title
  const titleContent = children || metadata?.title;
  
  if (!titleContent) {
    console.warn('Title: No title content provided via children or metadata');
    return null;
  }
  
  return (
    <h1 className={className}>
      {titleContent}
    </h1>
  );
}