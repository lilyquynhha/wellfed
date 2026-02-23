import { Heading } from "@/components/typography";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading size={1} text="Create a Meal/Recipe" className="mb-8" />
      {children}
    </>
  );
}
