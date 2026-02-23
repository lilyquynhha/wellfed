import { Heading } from "@/components/typography";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
      <Heading size={1} text="Public Food Database" className="mb-10"/>
      {children}
    </div>
  );
}
