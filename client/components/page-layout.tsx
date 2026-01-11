"use client";

import { useTokens } from "@/hooks/tokens";
import { TOKENS } from "@/lib/constants";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Footer from "./footer";
import Marquee from "./marquee";
import Navbar from "./navbar";

const PageLayout = ({ children }: { children?: React.ReactNode }) => {
  const tokenSigs = useMemo(() => TOKENS.map((acc) => acc.sig), []);

  const {
    data: tokenData,
    isLoading,
    error,
  } = useTokens({
    tokens: tokenSigs,
  });

  const [showToast, setShowToast] = useState(true);

  if (error) {
    if (showToast)
      toast("Error loading transactions", {
        description: error instanceof Error ? error.message : String(error),
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
            setShowToast(false);
          },
        },
      });
  }
  return (
    <div className="flex flex-col min-h-screen gap-5">
      <section className="flex flex-col">
        <Marquee tokens={tokenData} isLoading={isLoading} />
        <Navbar />
      </section>
      <div className="flex items-start justify-center font-sans min-h-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
