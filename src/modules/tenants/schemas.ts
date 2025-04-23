import { z } from "zod";

export const getOneTenantSchema = z.object({
  slug: z.string(),
});
