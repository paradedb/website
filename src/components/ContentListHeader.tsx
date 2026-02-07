interface ContentListHeaderProps {
  title: string;
  subtitle: string;
}

export function ContentListHeader({ title, subtitle }: ContentListHeaderProps) {
  return (
    <div className="relative border-b border-slate-200 dark:border-slate-900">
      <div className="pt-8 pb-10 md:py-12 px-4 md:px-12 relative">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
