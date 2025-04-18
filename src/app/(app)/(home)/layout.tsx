import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import Footer from "./footer";
import { NavBar } from "./navbar";
import { SearchFilters, SearchFiltersSkeleton } from "./search-filters";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <HydrateClient>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrateClient>
      <main className="flex-1 bg-[#f4f4f0]">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
