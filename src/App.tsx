import { useState } from "react";
import SearchBar from "./components/SearchBar";
import { CustomCacheContext } from "./contexts/customCacheContext";
import { Suggestions } from "./types/searchType";
import { Cache } from "./types/customCacheType";

function App() {
  const [cache, setCache] = useState<Cache>({});
  const defaultTTL = 3600; // 기본 캐시 유효 시간

  // 캐시에 데이터 추가
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

  // 캐시에서 데이터 조회
  const get = (key: string) => {
    const cachedItem = cache[key];
    if (cachedItem && Date.now() < cachedItem.expireTime) {
      return cachedItem.value;
    }
    // 만료된 캐시나 존재하지 않는 경우
    return null;
  };

  // 캐시에서 데이터 제거
  const remove = (key: string) => {
    const updatedCache = { ...cache };
    delete updatedCache[key];
    setCache(updatedCache);
  };

  // 모든 캐시 데이터 제거
  const clear = () => {
    setCache({});
  };

  // 커스텀 캐싱 컨텍스트 값
  const cacheContextValue = {
    set,
    get,
    remove,
    clear,
  };

  return (
    <CustomCacheContext.Provider value={cacheContextValue}>
      <SearchBar />
    </CustomCacheContext.Provider>
  );
}

export default App;
