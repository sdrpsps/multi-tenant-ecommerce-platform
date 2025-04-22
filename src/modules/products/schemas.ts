import { z } from "zod";

export const getProductsSchema = z.object({
  category: z.string().nullable().optional(),
});
