import { cx } from "@/lib/utils";
import type { BundledLanguage, BundledTheme, ShikiTransformer } from "shiki";
import { codeToHtml } from "shiki";
import CopyToClipboard from "./CopyToClipboard";

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
  className?: string;
  copy?: boolean;
  highlightLines?: number[];
};

export default async function Code({
  code,
  lang = "typescript",
  className,
  copy = true,
  highlightLines,
}: Props) {
  const transformers: ShikiTransformer[] | undefined = highlightLines?.length
    ? [
        {
          name: "drop-line-newlines",
          code(node) {
            node.children = node.children.filter(
              (child) =>
                !(child.type === "text" && child.value === "\n"),
            );
          },
        },
        {
          name: "highlight-lines",
          line(node, line) {
            if (highlightLines.includes(line)) {
              const existing =
                typeof node.properties.class === "string"
                  ? node.properties.class
                  : "";
              node.properties.class =
                `${existing} highlighted-line`.trim();
            }
          },
        },
      ]
    : undefined;

  const htmlLight = await codeToHtml(code, {
    lang,
    theme: "github-light",
    transformers,
  });

  const htmlDark = await codeToHtml(code, {
    lang,
    theme: "github-dark",
    transformers,
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
