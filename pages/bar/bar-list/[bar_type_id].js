import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BarListView from '@/components/bar/bar/bar-list-view';
import { BarService } from '@/services/bar-service';

export default function BarTypePage({ onPageChange }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('熱門酒吧');
  const { bar_type_id } = router.query;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 嘗試獲取分類名稱以顯示在標題
  useEffect(() => {
    if (bar_type_id) {
       const fetchType = async () => {
         try {
           const barTypes = await BarService.getBarTypes();
           const currentType = barTypes.find(t => String(t.bar_type_id) === String(bar_type_id));
           if (currentType) setDynamicTitle(currentType.bar_type_name);
         } catch (e) {
           console.error('Failed to fetch types for title', e);
         }
       };
       fetchType();
    }
  }, [bar_type_id]);

  if (!mounted || !router.isReady) return null;

  return (
    <BarListView
      category={bar_type_id}
      title={dynamicTitle}
      onPageChange={onPageChange}
    />
  );
}
