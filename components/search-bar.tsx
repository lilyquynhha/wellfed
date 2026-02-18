"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SearchBar({
  setSearchQuery,
  placeholder,
}: {
  setSearchQuery: (query: string) => void;
  placeholder?: string;
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
          placeholder={placeholder}
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
