"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { generateTenantUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="bg-white">
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

interface NavbarProps {
  slug: string;
}

export const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({ slug })
  );

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
          href={generateTenantUrl(slug)}
          className="flex items-center gap-2"
        >
          {tenant.image?.url && (
            <Image
              src={tenant.image?.url}
              alt={tenant.name}
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-[32px]"
            />
          )}
          <p className="text-xl">{tenant.name}</p>
        </Link>
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
        <Button disabled className="bg-white">
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
};
