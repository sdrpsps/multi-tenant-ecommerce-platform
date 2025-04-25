import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}

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
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrateClient>
  );
};

export default ProductPage;
