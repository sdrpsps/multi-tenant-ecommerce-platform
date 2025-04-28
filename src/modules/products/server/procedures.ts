import { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import { headers as getHeaders } from "next/headers";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { getProductSchema, getProductsSchema } from "../schemas";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(getProductSchema)
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      const data = await ctx.db.findByID({
        collection: "products",
        id: input.id,
      });

      let isPurchased = false;

      const reviews = await ctx.db.find({
        collection: "reviews",
        where: {
          product: {
            equals: input.id,
          },
        },
        pagination: false,
      });

      const reviewRating =
        reviews.docs.length === 0
          ? 0
          : reviews.docs.reduce(
              (acc, review) => acc + (review.rating ?? 0),
              0
            ) / reviews.totalDocs;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating]++;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] =
            Math.round(count / reviews.totalDocs) * 100;
        });
      }

      if (session.user) {
        const order = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              { product: { equals: input.id } },
              { user: { equals: session.user.id } },
            ],
          },
        });

        isPurchased = !!order.docs[0];
      }

      return {
        ...data,
        isPurchased,
        image: data.image as Media | null,
        tenant: data.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      };
    }),
  getMany: baseProcedure
    .input(getProductsSchema)
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "-createdAt";
      }

      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategories) => subcategories.slug
            )
          );
        }

        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategoriesSlugs],
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      const dataWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
          const reviewsData = await ctx.db.find({
            collection: "reviews",
            where: {
              product: {
                equals: doc.id,
              },
            },
            pagination: false,
          });

          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + (review.rating ?? 0),
                    0
                  ) / reviewsData.totalDocs,
          };
        })
      );

      return {
        ...data,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
