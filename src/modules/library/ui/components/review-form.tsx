"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { StarPicker } from "@/components/star-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createReviewSchema } from "@/modules/reviews/schemas";
import { useTRPC } from "@/trpc/client";

import type { ReviewsGetOneOutput } from "@/modules/reviews/server/types";

interface ReviewFormProps {
  productId: string;
  initialData: ReviewsGetOneOutput;
}

export const ReviewForm = ({ productId, initialData }: ReviewFormProps) => {
  const [isPreview, setIsPreview] = useState(!!initialData);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: createReview, isPending: isCreating } = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: () => {
        toast.error("Failed to create review");
      },
    })
  );
  const { mutate: updateReview, isPending: isUpdating } = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: () => {
        toast.error("Failed to create review");
      },
    })
  );

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productId,
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof createReviewSchema>) => {
    if (initialData) {
      updateReview({
        reviewId: initialData.id,
        rating: data.rating,
        description: data.description,
      });
    } else {
      createReview(data);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Like it? Give it a review!"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write a review..."
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant="elevated"
            disabled={isCreating || isUpdating}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}
        {isPreview && (
          <Button
            variant="elevated"
            type="button"
            size="lg"
            onClick={() => setIsPreview(false)}
            className="w-fit"
          >
            Edit
          </Button>
        )}
      </form>
    </Form>
  );
};

export const ReviewFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="font-medium">Like it? Give it a review!</p>
      <StarPicker disabled />
      <Textarea placeholder="Write a review..." disabled />
      <Button
        variant="elevated"
        disabled
        type="submit"
        size="lg"
        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
      >
        Post review
      </Button>
    </div>
  );
};
