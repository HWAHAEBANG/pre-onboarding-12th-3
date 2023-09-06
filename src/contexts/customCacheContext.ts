import { createContext } from "react";
import { CacheContextValue } from "../types/customCacheType";

export const CustomCacheContext = createContext<CacheContextValue | undefined>(
  undefined,
);
