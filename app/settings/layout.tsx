import { Heading } from "@/components/typography";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading size={1} text="Settings" className="mb-8" />
      <Suspense fallback="Loading account settings...">{children}</Suspense>
    </>
  );
}
