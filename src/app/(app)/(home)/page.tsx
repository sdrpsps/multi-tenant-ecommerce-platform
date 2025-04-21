"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="p-4">
      <pre>{JSON.stringify(data?.user, null, 2)}</pre>
    </div>
  );
}
