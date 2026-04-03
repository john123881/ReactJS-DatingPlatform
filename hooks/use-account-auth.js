import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import { toast as customToast } from '@/lib/toast';

/**
 * 會員中心專用授權 Hook
 * 自動處理 router.isReady 偵測、頁面加載動畫、以及授權檢查
 * @param {function} onAuthorized - 授權成功後的資料抓取回呼函數 (params: sid, page)
 * @returns {object} { isFetched, auth, router }
 */
export function useAccountAuth(onAuthorized) {
  const router = useRouter();
  const { auth, checkAuth } = useAuth();
  const { open, close, isLoading } = useLoader();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchCheck = async () => {
      // 確保路由已就緒且有 sid
      if (!router.isReady || !router.query.sid) return;
      
      open();
      setIsFetched(false);
      try {
        // 如果還沒獲得基本 auth 狀態則跳過 (等待 Context 平穩)
        if (auth.id === 0) {
          return;
        }

        // 執行深層授權檢查 (確認 sid 與目前登入 user 匹配)
        const result = await checkAuth(router.query.sid);
        if (!result.success) {
          customToast.error(result.message || '驗證失敗');
          router.push('/');
          return;
        }
        
        // 執行資料回呼
        if (onAuthorized) {
          await onAuthorized(router.query.sid, router.query.page || 1);
        }
      } catch (error) {
        console.error('Account Auth Error:', error);
      } finally {
        setIsFetched(true);
        close(0.2); // 稍微縮短動畫時間提升流暢感
      }
    };

    fetchCheck();
  }, [router.isReady, router.query.sid, router.query.page, auth.id]);

  return { isFetched, auth, router, isLoading };
}
