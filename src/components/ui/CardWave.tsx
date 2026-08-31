"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false },
);

export function CardWave({ color }: { color: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 md:h-20 [mask-image:linear-gradient(to_top,black,transparent)]"
    >
      <Dithering
        width="100%"
        height="100%"
        colorBack="#00000000"
        colorFront={color}
        shape="wave"
        type="8x8"
        size={5}
        speed={0.2}
        scale={1.2}
      />
    </div>
  );
}
