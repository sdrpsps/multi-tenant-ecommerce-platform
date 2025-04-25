import { z } from "zod";

export const getReviewSchema = z.object({
  productId: z.string(),
});

export const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

export const updateReviewSchema = z.object({
  reviewId: z.string(),
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});
