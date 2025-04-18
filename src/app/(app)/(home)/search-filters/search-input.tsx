"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CategoriesSidebar from "./categories-sidebar";

interface SearchInputProps {
  disabled?: boolean;
}

const SearchInput = ({ disabled }: SearchInputProps) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSideBarOpen} onOpenChange={setIsSideBarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4" />
        <Input
          className="pl-8"
          placeholder="Search products..."
          disabled={disabled}
        />
      </div>

      <Button
        variant="elevated"
        className="lg:hidden size-12 shrink-0"
        onClick={() => setIsSideBarOpen(true)}
      >
        <ListFilterIcon className="size-4" />
      </Button>
      {/* TODO: add library button */}
    </div>
  );
};

export default SearchInput;
