import { z } from "zod";

export const getProductsSchema = z.object({
  category: z.string().nullable().optional(),
  minPrice: z.string().nullable().optional(),
  maxPrice: z.string().nullable().optional(),
});
