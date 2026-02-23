import { Heading } from "@/components/typography";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
     <Heading size={1} text="Edit Creation" className="mb-8"/>
      <Suspense fallback="Loading creation...">{children}</Suspense>
    </div>
  );
}
