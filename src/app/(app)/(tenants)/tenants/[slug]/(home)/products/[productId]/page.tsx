import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}

export const dynamic = "force-dynamic";

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrateClient>
  );
};

export default ProductPage;
