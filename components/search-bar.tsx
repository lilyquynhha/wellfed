"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Update URL's query parameter with user input
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`${pathname}?query=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <div id="search-bar" className="flex w-full gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter food name"
          className="h-10"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="h-10" onClick={handleSearch}>
          Search
        </Button>
      </div>
    </>
  );
}
