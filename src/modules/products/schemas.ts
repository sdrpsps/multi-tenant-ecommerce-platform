import { z } from "zod";

import { sortValues } from "./search-params";
import { DEFAULT_LIMIT } from "../tags/constant";

export const getProductSchema = z.object({
  id: z.string(),
});

export const getProductsSchema = z.object({
  cursor: z.number().default(1),
  limit: z.number().default(DEFAULT_LIMIT),
  search: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  minPrice: z.string().nullable().optional(),
  maxPrice: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  sort: z.enum(sortValues).nullable().optional(),
  tenantSlug: z.string().nullable().optional(),
});
