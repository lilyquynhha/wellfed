import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
      <h1 className="text-5xl mb-10">Account settings</h1>
      <Suspense>{children}</Suspense>
    </div>
  );
}
