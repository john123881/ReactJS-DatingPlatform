import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BarListView from '@/components/bar/bar/bar-list-view';
import { BarService } from '@/services/bar-service';

export default function BarAreaPage({ onPageChange }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('熱門酒吧');
  const { bar_area_id } = router.query;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 嘗試獲取地區名稱以顯示在標題
  useEffect(() => {
    if (bar_area_id) {
       const fetchArea = async () => {
         try {
           const areas = await BarService.getBarAreas();
           const currentArea = areas.find(a => String(a.bar_area_id) === String(bar_area_id));
           if (currentArea) setDynamicTitle(`${currentArea.bar_area_name}酒吧`);
         } catch (e) {
           console.error('Failed to fetch areas for title', e);
         }
       };
       fetchArea();
    }
  }, [bar_area_id]);

  if (!mounted || !router.isReady) return null;

  return (
    <BarListView
      category={null} // 地區篩選通常透過 Sidebar 或 URL 參數，BarListView 的 useBarList 會處理
      title={dynamicTitle}
      onPageChange={onPageChange}
    />
  );
}
