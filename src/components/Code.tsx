import { cx } from "@/lib/utils";
import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";
import CopyToClipboard from "./CopyToClipboard";

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
  className?: string;
  copy?: boolean;
};

export default async function Code({
  code,
  lang = "typescript",
  copy = false,

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
      {copy && (
        <div className="absolute right-0 h-full">
          <div className="absolute right-3 top-3">
            <CopyToClipboard code={code} />
          </div>
        </div>
      )}
      <div
        className="text-sm [&>pre]:overflow-x-auto [&>pre]:py-6 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}
