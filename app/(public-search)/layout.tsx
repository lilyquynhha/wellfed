import { Heading } from "@/components/typography";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading size={1} text="Public Food Database" className="mb-10" />
      {children}
    </>
  );
}
