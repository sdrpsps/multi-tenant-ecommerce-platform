import { Media, Tenant } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { getProductsSchema } from "../schemas";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(getProductsSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (data.totalDocs !== data.docs.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);

        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
