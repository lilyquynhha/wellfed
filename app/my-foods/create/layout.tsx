import { Heading } from "@/components/typography";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto md:w-[80%] lg:w-[70%] py-6 px-6 overflow-x-hidden">
      <Heading size={1} text="Create a Food" className="mb-4" />
      {children}
    </div>
  );
}
