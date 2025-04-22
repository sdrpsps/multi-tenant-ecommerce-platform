import { Suspense } from "react";

import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrateClient>
  );
};

export default CategoryPage;
