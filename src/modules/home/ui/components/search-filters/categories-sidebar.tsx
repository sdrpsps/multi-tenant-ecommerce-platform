"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useTRPC } from "@/trpc/client";

import type {
  CategoriesGetManyOutput,
  CategoriesGetManyOutputSingle,
} from "@/modules/categories/server/types";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoriesSidebar = ({ open, onOpenChange }: CategoriesSidebarProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());

  const [currentCategories, setCurrentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedParent, setSelectedParent] =
    useState<CategoriesGetManyOutputSingle | null>(null);

  const categoriesToShow = currentCategories ?? data ?? [];
  const backgroundColor = selectedParent?.color || "white";

  const handleOpenChange = (open: boolean) => {
    setCurrentCategories(null);
    setSelectedParent(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutputSingle) => {
    if (
      category.subcategories &&
      Array.isArray(category.subcategories) &&
      category.subcategories.length > 0
    ) {
      setSelectedParent(category);
      setCurrentCategories(category.subcategories as CategoriesGetManyOutput);
    } else {
      if (currentCategories && selectedParent) {
        router.push(`/${selectedParent.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    setCurrentCategories(null);
    setSelectedParent(null);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="gap-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {currentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4" />
              Back
            </button>
          )}
          {categoriesToShow.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories &&
                Array.isArray(category.subcategories) &&
                category.subcategories.length > 0 && (
                  <ChevronRightIcon className="size-4" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoriesSidebar;
