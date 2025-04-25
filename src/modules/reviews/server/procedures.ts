import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import {
  createReviewSchema,
  getReviewSchema,
  updateReviewSchema,
} from "../schemas";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(getReviewSchema)
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewsData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session?.user.id } },
          ],
        },
      });

      const review = reviewsData.docs[0];

      if (!review) {
        return null;
      }

      return review;
    }),

  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session?.user.id } },
          ],
        },
      });

      if (existingReviewData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session?.user.id,
          product: input.productId,
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),

  update: protectedProcedure
    .input(updateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.db.findByID({
        collection: "reviews",
        depth: 0,
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});
