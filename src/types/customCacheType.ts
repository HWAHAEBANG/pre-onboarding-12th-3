import { Suggestions } from "./searchType";

export interface Cache {
  [key: string]: { value: Suggestions; expireTime: number };
}

export interface CacheContextValue {
  set: (key: string, value: Suggestions, ttl?: number) => void;
  get: (key: string) => Suggestions | null;
}
