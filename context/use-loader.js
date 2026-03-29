import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// 1. 建立context
const LoaderContext = createContext();

// 2. 建立一個Context Provider元件
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const close = useCallback((sec = 1) => {
    setTimeout(() => {
      setIsLoading(false);
    }, sec * 1000);
  }, []);

  const open = useCallback(() => {
    setIsLoading(true);
  }, []);

  const value = useMemo(() => ({ isLoading, close, open }), [isLoading, close, open]);

  return (
    // 使用value屬性提供資料給提供者階層以下的所有後代元件
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};

// 3. 提供一個包裝好useContext名稱，給消費者(Consumer)方便地直接呼叫使用
export const useLoader = () => useContext(LoaderContext);
