import { useQueryStates } from "nuqs";
import { createLoader } from "nuqs/server";

import { params } from "../search-params";

export const useProductFilters = () => {
  return useQueryStates(params);
};

export const loadProductFilters = createLoader(params);
