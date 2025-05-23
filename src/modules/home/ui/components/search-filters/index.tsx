"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { DEFAULT_CATEGORY_COLOR } from "@/modules/home/constants";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";

import BreadcrumbNavigation from "./breadcrumb-navigation";
import Categories from "./categories";
import SearchInput from "./search-input";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const [filters, setFilters] = useProductFilters();

  const params = useParams();
  const activeCategory = params.category || "all";

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryColor =
    activeCategoryData?.color || DEFAULT_CATEGORY_COLOR;
  const activeCategoryName = activeCategoryData?.name;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryData = activeCategoryData?.subcategories.find(
    (subcategory) => subcategory.slug === activeSubcategory
  );
  const activeSubcategoryName = activeSubcategoryData?.name;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput
        defaultValue={filters.search}
        onChange={(value) => setFilters({ search: value })}
      />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory as string}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full bg-[#f5f5f5]">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11"></div>
      </div>
    </div>
  );
};
