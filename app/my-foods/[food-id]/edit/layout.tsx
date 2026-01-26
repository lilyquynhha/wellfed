import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
      <h1 className="text-5xl mb-6">Edit Food</h1>
      <Suspense fallback="Loading food details...">{children}</Suspense>
    </div>
  );
}
