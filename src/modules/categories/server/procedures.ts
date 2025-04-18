import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.find({
      collection: "categories",
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = categories.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs || []).map((subCategory) => ({
        // Because of "depth: 1" we are confident "doc" will be a type of Category
        ...(subCategory as Category),
        subcategories: undefined,
      })),
    }));

    return formattedData;
  }),
});
