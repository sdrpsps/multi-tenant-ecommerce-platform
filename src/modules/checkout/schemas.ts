import { z } from "zod";

export const getProductsSchema = z.object({
  ids: z.array(z.string()),
});
