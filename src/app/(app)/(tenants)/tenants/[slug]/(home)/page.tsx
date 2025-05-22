import { SearchParams } from "nuqs/server";

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/hooks/use-product-filters";
import { DEFAULT_LIMIT } from "@/modules/tags/constant";
import ProductListView from "@/modules/products/ui/views/product-list-view";

interface TenantsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

const TenantsPage = async ({ params, searchParams }: TenantsPageProps) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrateClient>
  );
};

export default TenantsPage;
