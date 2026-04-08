import { useState, useMemo, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { BarService } from '@/services/bar-service';
import { useRouter } from 'next/router';

/**
 * 自定義 Hook: 處理酒吧列表邏輯 (SWR 快取版)
 * @param {string} category - 酒吧分類 (如 'sport', 'music')
 * @returns {object} bars 相關狀態與處理函數
 */
export function useBarList(category) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [barsPerPage] = useState(12);
  
  // 從 router.query 初始化或預設為空字串
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');

  // 監聽 URL 參數變化並同步到本地狀態
  useEffect(() => {
    if (router.isReady) {
      const area = router.query.bar_area_id || '';
      const type = router.query.bar_type_id || '';
      setSelectedAreaId(area);
      setSelectedTypeId(type);
    }
  }, [router.isReady, router.query.bar_area_id, router.query.bar_type_id]);

  // SWR 快取金鑰 - 使用 useMemo 確保金鑰穩定
  const swrKey = useMemo(
    () => ['bar-list', category, selectedAreaId, selectedTypeId],
    [category, selectedAreaId, selectedTypeId]
  );

  // 使用 SWR 進行抓取與快取
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => category 
      ? BarService.getBarsByCategory(category, { area: selectedAreaId, type: selectedTypeId })
      : BarService.getBars({ bar_area_id: selectedAreaId, bar_type_id: selectedTypeId }),
    {
      revalidateOnFocus: false, // 避免點擊視窗就重新抓
      dedupingInterval: 60000,  // 1 分鐘內不重複抓取
    }
  );

  // 取得資料陣列 (使用 useMemo 確保空陣列 [] 的參考穩定)
  const bars = useMemo(() => data || [], [data]);

  // 計算分頁資訊
  const totalPages = Math.ceil(bars.length / barsPerPage);
  const maxPageNumberLimit = Math.min(currentPage + 2, totalPages);
  const minPageNumberLimit = Math.max(currentPage - 2, 1);

  // 事件處理器 - 使用 useCallback 確保參考穩定
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const onAreaSelected = useCallback((areaId) => {
    const newQuery = { ...router.query };
    if (areaId) newQuery.bar_area_id = areaId;
    else delete newQuery.bar_area_id;

    // 使用淺層路由更新 URL 並保持組合狀態
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
    setCurrentPage(1);
  }, [router]);

  const onTypeSelected = useCallback((typeId) => {
    const newQuery = { ...router.query };
    if (typeId) newQuery.bar_type_id = typeId;
    else delete newQuery.bar_type_id;

    // 使用淺層路由更新 URL 並保持組合狀態
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
    setCurrentPage(1);
  }, [router]);

  return {
    bars,
    error,
    isLoading,
    currentPage,
    setCurrentPage,
    barsPerPage,
    selectedAreaId,
    selectedTypeId,
    totalPages,
    maxPageNumberLimit,
    minPageNumberLimit,
    handlePageChange,
    onAreaSelected,
    onTypeSelected,
    refresh: mutate
  };
}
