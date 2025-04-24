import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCart } from "@/modules/checkout/hooks/use-cart";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
}

export const CartButton = ({ tenantSlug, productId }: CartButtonProps) => {
  const { toggleProduct, isProductInCart } = useCart(tenantSlug);

  const isInCart = isProductInCart(productId);

  return (
    <Button
      variant="elevated"
      className={cn("flex-1 bg-pink-400", isInCart && "bg-white")}
      onClick={() => toggleProduct(productId)}
    >
      {isInCart ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
