import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { getTagsSchema } from "../schemas";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure.input(getTagsSchema).query(async ({ ctx, input }) => {
    const data = await ctx.db.find({
      collection: "tags",
      page: input.cursor,
      limit: input.limit,
    });

    return data;
  }),
});
