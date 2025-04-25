"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { ReviewForm } from "./review-form";

interface ReviewSideBarProps {
  productId: string;
}

export const ReviewSideBar = ({ productId }: ReviewSideBarProps) => {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return <ReviewForm productId={productId} initialData={review} />;
};
