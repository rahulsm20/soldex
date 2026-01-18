"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ArchitectureImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === "dark";

  return (
    <div key={isDarkMode ? "dark" : "light"}>
      <Image
        key={isDarkMode ? `arch-dark` : `arch-light`}
        loading="lazy"
        src={`${isDarkMode ? "/arch-dark.png" : "/arch.png"}?theme=${isDarkMode ? "dark" : "light"}`}
        alt="Soldex architecture diagram"
        width={1000}
        height={400}
      />
    </div>
  );
}
