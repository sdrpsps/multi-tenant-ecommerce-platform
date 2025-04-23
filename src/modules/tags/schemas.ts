import { z } from "zod";
import { DEFAULT_LIMIT } from "./constant";

export const getTagsSchema = z.object({
  cursor: z.number().default(1),
  limit: z.number().default(DEFAULT_LIMIT),
});
