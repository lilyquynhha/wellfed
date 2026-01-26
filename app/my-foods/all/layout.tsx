import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-6 px-6">
      <h1 className="text-5xl mb-6">My Foods</h1>
      <Button className="mb-6">
        <Plus />
        <Link href="/my-foods/create"> Create a food</Link>
      </Button>
      <SearchBar />
      <Suspense>{children}</Suspense>
    </div>
  );
}
