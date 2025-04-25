import { z } from "zod";

import { DEFAULT_LIMIT } from "../tags/constant";

export const getLibrarySchema = z.object({
  cursor: z.number().default(1),
  limit: z.number().default(DEFAULT_LIMIT),
});
