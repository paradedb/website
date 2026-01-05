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
  className,
  copy = true,
}: Props) {
  const htmlLight = await codeToHtml(code, {
    lang,
    theme: "github-light",
  });

  const htmlDark = await codeToHtml(code, {
    lang,
    theme: "github-dark",
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
        className="text-sm dark:hidden [&>pre]:overflow-x-auto [&>pre]:py-6 [&>pre]:pl-2 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: htmlLight }}
      ></div>
      <div
        className="text-sm hidden dark:block [&>pre]:overflow-x-auto [&>pre]:py-6 [&>pre]:pl-2 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: htmlDark }}
      ></div>
    </div>
  );
}
