import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";

export function BookNote({
  src,
  alt,
  children,
}: {
  src: StaticImageData;
  alt: string;
  children: ReactNode;
}) {
  return (
    <div className="my-8 flex gap-5 rounded-lg border-l-[3px] border-indigo-400 bg-indigo-50 px-5 py-5 dark:border-indigo-500 dark:bg-indigo-950/40">
      <div className="hidden shrink-0 sm:block">
        <Image
          src={src}
          alt={alt}
          width={100}
          height={150}
          className="rounded shadow-md"
        />
      </div>
      <div className="text-gray-800 dark:text-gray-200 [&>p:last-child]:mb-0 [&>p]:mb-2">
        {children}
      </div>
    </div>
  );
}
