"use client";

import { useQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

import CategoriesSidebar from "./categories-sidebar";

interface SearchInputProps {
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const SearchInput = ({
  defaultValue,
  disabled,
  onChange,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(defaultValue || "");
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    if (!isComposing) {
      const timeoutId = setTimeout(() => {
        onChange?.(searchValue);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchValue, onChange, isComposing]);

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSideBarOpen} onOpenChange={setIsSideBarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4" />
        <Input
          className="pl-8"
          placeholder="Search products..."
          disabled={disabled}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            setSearchValue(e.currentTarget.value);
          }}
        />
      </div>
      <Button
        variant="elevated"
        className="lg:hidden size-12 shrink-0"
        onClick={() => setIsSideBarOpen(true)}
      >
        <ListFilterIcon className="size-4" />
      </Button>
      {session?.user && (
        <Button variant="elevated" asChild>
          <Link prefetch href="/library">
            <BookmarkCheckIcon className="size-4" />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
