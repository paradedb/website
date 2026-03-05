import Image, { ImageProps } from "next/image";
import Link from "next/link";
import React from "react";
import { cx } from "@/lib/utils";

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

type CustomHeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: React.ReactNode;
};

function CustomHeading({ level, className, children }: CustomHeadingProps) {
  const slug = slugify(children ? String(children) : "");
  return React.createElement(
    `h${level}`,
    {
      id: slug,
      className: cx("scroll-mt-36 md:scroll-mt-24 group relative", className),
    },
    [
      React.createElement("a", {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: "anchor-link",
      }),
      children,
    ],
  );
}

export const H1 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <h1 className="text-2xl font-bold normal-case tracking-tight text-gray-900 dark:text-white scroll-mt-36 md:scroll-mt-24">
    {children}
  </h1>
);

export const H2 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <CustomHeading level={2}>{children}</CustomHeading>
);

export const H3 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <CustomHeading
    className="mb-2 font-semibold normal-case tracking-tight text-gray-900 dark:text-white"
    level={3}
  >
    {children}
  </CustomHeading>
);

export const P = (props: React.HTMLProps<HTMLParagraphElement>) => (
  <p {...props} className="mb-8 leading-7 text-gray-600 dark:text-slate-300" />
);

export const Ul = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    className="mb-10 ml-[30px] list-['–__'] space-y-1 leading-8 text-gray-600 dark:text-slate-300"
    {...props}
  />
);

export const Bold = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className="font-semibold text-gray-900 dark:text-white" {...props} />
);

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function CustomLink({
  href,
  children,
  className,
  ...props
}: CustomLinkProps) {
  const style = cx("text-indigo-600 font-medium hover:text-indigo-500", className);
  if (href.startsWith("/")) {
    return (
      <Link className={style} href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={style} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={style}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

export const ChangelogEntry = ({
  version,
  date,
  children,
}: {
  version: string;
  date: string;
  children: React.ReactNode;
}) => (
  <div className="relative my-20 flex flex-col justify-center gap-x-14 border-b border-gray-200 md:flex-row">
    <div className="mb-4 md:mb-10 md:w-1/3">
      <div className="sticky top-24 flex items-center space-x-2 md:block md:space-x-0 md:space-y-1.5">
        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          {version}
        </span>
        <span className="block whitespace-nowrap text-sm text-gray-600">
          {date}
        </span>
      </div>
    </div>
    <div className="mb-12">{children}</div>
  </div>
);

export const ChangelogImage = ({
  alt,
  width = 1200,
  height = 675,
  src,
  ...props
}: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className="mb-10 overflow-hidden rounded-xl shadow-md shadow-black/15 ring-1 ring-gray-200/50"
    {...props}
  />
);
