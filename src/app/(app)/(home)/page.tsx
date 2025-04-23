import { SearchParams } from "nuqs/server";

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/hooks/use-product-filters";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/modules/tags/constant";

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { minPrice, maxPrice } = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      minPrice,
      maxPrice,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
};

export default HomePage;
