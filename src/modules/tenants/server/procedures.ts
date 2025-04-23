import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { Media, Tenant } from "@/payload-types";
import { getOneTenantSchema } from "../schemas";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(getOneTenantSchema)
    .query(async ({ ctx, input }) => {
      const tenants = await ctx.db.find({
        collection: "tenants",
        depth: 1,
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });

      const tenant = tenants.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      return tenant as Tenant & { image: Media };
    }),
});
