import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import { AccountService } from '@/services/account-service';
import toast from 'react-hot-toast';

/**
 * useAccountRecords - 處理積分紀錄與遊戲紀錄的狀態與分頁
 * @returns {object} 包含 records, filters, pagination 等狀態
 */
export const useAccountRecords = () => {
  const router = useRouter();
  const { auth, checkAuth } = useAuth();
  const { open, close, isLoading } = useLoader();
  
  const [gameRecordOpen, setGameRecordOpen] = useState(false);
  const [pointSource, setPointSource] = useState('全部');
  const [dateSortToggle, setDateSortToggle] = useState(false);
  const [valueDateBegin, setValueDateBegin] = useState('');
  const [valueDateEnd, setValueDateEnd] = useState('');
  
  const [pointRecords, setPointRecords] = useState({ rows: [], page: 0, totalPages: 0 });
  const [gameRecords, setGameRecords] = useState({ rows: [], page: 0, totalPages: 0 });

  // 統一跳轉處理 (常用於分頁或篩選)
  const updateQuery = useCallback((newParams) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...newParams }
    }, undefined, { scroll: false });
  }, [router]);

  // 拉取資料邏輯
  const loadData = useCallback(async () => {
    if (!router.isReady || !router.query.sid || auth.id === 0) return;
    
    open();
    try {
      const authResult = await checkAuth(router.query.sid);
      if (!authResult.success) {
        router.push('/');
        toast.error(authResult.message || '驗證失敗');
        return;
      }

      if (gameRecordOpen) {
        const result = await AccountService.getGameRecord(router.query.sid, location.search);
        if (result.success) {
          setGameRecords({
            rows: result.data || [],
            page: result.page || 0,
            totalPages: result.totalPages || 0
          });
        }
      } else {
        const result = await AccountService.getPointRecord(router.query.sid, location.search);
        if (result.success) {
          setPointRecords({
            rows: result.data || [],
            page: result.page || 0,
            totalPages: result.totalPages || 0
          });
        }
      }
    } catch (error) {
      console.error('loadData error:', error);
    } finally {
      close(0.5);
    }
  }, [router.isReady, router.query.sid, auth.id, gameRecordOpen, checkAuth, open, close]);

  useEffect(() => {
    loadData();
  }, [loadData, router.query.page, router.query.selectedValue, router.query.date_begin, router.query.date_end, router.query.sortDate]);

  return {
    isLoading,
    gameRecordOpen,
    setGameRecordOpen,
    pointSource,
    setPointSource,
    valueDateBegin,
    setValueDateBegin,
    valueDateEnd,
    setValueDateEnd,
    dateSortToggle,
    setDateSortToggle,
    pointRecords,
    gameRecords,
    updateQuery,
    sid: router.query.sid
  };
};
