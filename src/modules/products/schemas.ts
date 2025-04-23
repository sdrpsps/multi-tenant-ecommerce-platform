import { z } from "zod";

import { sortValues } from "./search-params";

export const getProductsSchema = z.object({
  category: z.string().nullable().optional(),
  minPrice: z.string().nullable().optional(),
  maxPrice: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  sort: z.enum(sortValues).nullable().optional(),
});
