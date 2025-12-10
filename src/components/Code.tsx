import { cx } from "@/lib/utils";
import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
  className?: string;
};

export default async function Code({
  code,
  lang = "typescript",
  // tokyo-night
  // catppuccin-macchiato
  // min-dark
  // poimandres
  theme = "catppuccin-macchiato",
  className,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,
  });

  return (
    <div className={cx("relative w-full", className)}>
      <div
        className="text-sm [&>pre]:overflow-x-auto [&>pre]:py-6 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}
