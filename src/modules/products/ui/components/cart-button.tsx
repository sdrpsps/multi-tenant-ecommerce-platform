import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCart } from "@/modules/checkout/hooks/use-cart";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({
  tenantSlug,
  productId,
  isPurchased,
}: CartButtonProps) => {
  const { toggleProduct, isProductInCart } = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        variant="elevated"
        asChild
        className="flex-1 font-medium bg-white"
      >
        <Link prefetch href={`/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );
  }

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
