import { SearchParams } from "nuqs/server";

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/hooks/use-product-filters";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/modules/tags/constant";

interface SubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
  searchParams: Promise<SearchParams>;
}

const SubcategoryPage = async ({
  params,
  searchParams,
}: SubcategoryPageProps) => {
  const { subcategory: category } = await params;
  const { minPrice, maxPrice } = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category,
      minPrice,
      maxPrice,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  );
};

export default SubcategoryPage;
