import { z } from "zod";

export const getProductsSchema = z.object({
  ids: z.array(z.string()),
});

export const purchaseSchema = z.object({
  productIds: z.array(z.string()),
  tenantSlug: z.string().min(1),
});
