import { Heading } from "@/components/typography";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading size={1} text="Account Setup" className="mb-10" />
      <Suspense fallback="Setting up your account...">{children}</Suspense>
    </>
  );
}
