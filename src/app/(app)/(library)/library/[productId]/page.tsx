import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface LibraryProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const LibraryProductPage = async ({ params }: LibraryProductPageProps) => {
  const { productId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrateClient>
  );
};

export default LibraryProductPage;
