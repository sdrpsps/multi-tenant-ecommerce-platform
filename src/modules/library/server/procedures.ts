import { Media, Product, Review, Tenant } from "@/payload-types";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getLibraryOneSchema, getLibrarySchema } from "../schemas";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(getLibraryOneSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      const order = data.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

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

      return product;
    }),
  getMany: protectedProcedure
    .input(getLibrarySchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = data.docs.map((order) => order.product);

      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Fetch all reviews for all products in a single query
      const allReviews = await ctx.db.find({
        collection: "reviews",
        where: {
          product: {
            in: productIds,
          },
        },
        pagination: false,
      });

      // Group reviews by product
      const reviewsByProduct = allReviews.docs.reduce(
        (acc, review) => {
          const { id: productId } = review.product as Product;
          if (!acc[productId]) {
            acc[productId] = [];
          }
          acc[productId].push(review);
          return acc;
        },
        {} as Record<string, Review[]>
      );

      // Add review data to each product
      const dataWithSummarizedReviews = productsData.docs.map((doc) => {
        const productReviews = reviewsByProduct[doc.id] || [];
        const reviewCount = productReviews.length;
        const reviewRating =
          reviewCount === 0
            ? 0
            : productReviews.reduce(
                (acc, review) => acc + (review.rating ?? 0),
                0
              ) / reviewCount;

        return {
          ...doc,
          reviewCount,
          reviewRating,
        };
      });

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
