import { useState } from "react";
import SearchBar from "./components/SearchBar";
import { CustomCacheContext } from "./contexts/customCacheContext";
import { Suggestions } from "./types/searchType";
import { Cache } from "./types/customCacheType";

function App() {
  const [cache, setCache] = useState<Cache>({});
  const defaultTTL = 3600;

  const set = (key: string, value: Suggestions, ttl = defaultTTL) => {
    const expireTime = Date.now() + ttl * 1000;
    setCache({
      ...cache,
      [key]: {
        value,
        expireTime,
      },
    });
  };

  const get = (key: string) => {
    const cachedItem = cache[key];
    if (cachedItem && Date.now() < cachedItem.expireTime) {
      return cachedItem.value;
    }
    return null;
  };

  const cacheContextValue = {
    set,
    get,
  };

  return (
    <CustomCacheContext.Provider value={cacheContextValue}>
      <SearchBar />
    </CustomCacheContext.Provider>
  );
}

export default App;
