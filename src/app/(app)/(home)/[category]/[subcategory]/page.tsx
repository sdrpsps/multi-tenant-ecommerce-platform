import { Suspense } from "react";

import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface SubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

const SubcategoryPage = async ({ params }: SubcategoryPageProps) => {
  const { subcategory } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrateClient>
  );
};

export default SubcategoryPage;
