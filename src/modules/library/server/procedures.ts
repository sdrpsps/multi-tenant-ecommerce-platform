import { Media, Tenant } from "@/payload-types";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { getLibrarySchema } from "../schemas";

export const libraryRouter = createTRPCRouter({
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

      return {
        ...productsData,
        docs: productsData.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
