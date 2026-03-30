import { createContext, useContext, useMemo } from 'react';
import { toast as customToast } from '@/lib/toast';

// 1. 建立context
const NotifyContext = createContext(null);

// 2. 建立一個Context Provider元件
export function NotifyProvider({ children }) {
  const notify = (msg) => customToast.info(msg);

  const notifySuccess = (msg) => customToast.success(msg);

  const notifyError = (msg) => customToast.error(msg);

  const notifyLoading = (msg) => customToast.loading(msg);

  const notifyPromise = (promiseFunc, options) => {
    return customToast.promise(promiseFunc, options);
  };

  const value = useMemo(
    () => ({
      notify,
      notifySuccess,
      notifyError,
      notifyPromise,
      notifyLoading,
    }),
    [notify, notifySuccess, notifyError, notifyPromise, notifyLoading],
  );

  return (
    <NotifyContext.Provider value={value}>
      {children}
    </NotifyContext.Provider>
  );
}

// 3. 提供一個包裝好useContext名稱，給消費者(Consumer)方便地直接呼叫使用
export const useNotify = () => useContext(NotifyContext);
