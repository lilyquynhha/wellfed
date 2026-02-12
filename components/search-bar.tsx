"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SearchBar({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(query);
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
