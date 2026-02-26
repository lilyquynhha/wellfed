import { Heading } from "@/components/typography";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <Heading size={1} text="Edit Creation" className="mb-8"/>
      <Suspense fallback="Loading creation details...">{children}</Suspense>
    </>
  );
}
