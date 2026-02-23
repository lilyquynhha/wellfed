import { Heading } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading size={1} text="My Creations" className="mb-4" />

      <Link href="/my-creations/create">
        <Button className="mb-6">
          <Plus />
          Create a meal/recipe
        </Button>
      </Link>

      {children}
    </>
  );
}
