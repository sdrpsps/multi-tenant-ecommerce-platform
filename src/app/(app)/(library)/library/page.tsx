import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

import { LibraryView } from "@/modules/library/ui/views/library-view";
import { DEFAULT_LIMIT } from "@/modules/tags/constant";

export const dynamic = "force-dynamic";

const LibraryPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
};

export default LibraryPage;
