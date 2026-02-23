import { Heading } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
      <Heading size={1} text="My Foods" className="mb-4"/>

      <Link href="/my-foods/create">
        <Button className="mb-6">
          <Plus />
          Create a food
        </Button>
      </Link>

      {children}
    </div>
  );
}
