import { Suspense } from "react";

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";

interface TenantHomeLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const TenantHomeLayout = async ({
  params,
  children,
}: TenantHomeLayoutProps) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <HydrateClient>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
        <div className="flex-1">
          <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
        </div>
        <Footer />
      </HydrateClient>
    </div>
  );
};

export default TenantHomeLayout;
