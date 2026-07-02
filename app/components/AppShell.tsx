"use client";

import { useEffect, useState } from "react";
import Preloader from "./Preloader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (!showPreloader) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreloader]);

  return (
    <>
      <Preloader
        visible={showPreloader}
        onExitComplete={() => setShowPreloader(false)}
      />
      <div
        style={{
          opacity: showPreloader ? 0 : 1,
          transition: "opacity 0.45s ease 0.12s",
        }}
      >
        {children}
      </div>
    </>
  );
}
