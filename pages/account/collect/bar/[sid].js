import { useState, useCallback, useRef } from 'react';
import CollectionView from '@/components/account-center/collection-view';
import BarCollectCard from '@/components/account-center/collect-list/bar-collect-card';
import { AccountService } from '@/services/account-service';
import { useCollect } from '@/context/use-collect';
import { toast as customToast } from '@/lib/toast';

export default function AccountCollectBar({ onPageChange }) {
  const { bars, setBars, refreshCollectList } = useCollect();
  const [pages, setPages] = useState({ page: 1, totalPages: 1 });
  const [arrowHovered, setArrowHovered] = useState([]);
  const interactingItems = useRef(new Set());

  // 資料抓取邏輯
  const fetchData = useCallback(async (sid, page) => {
    try {
      const result = await AccountService.collectBar.get(sid, `?page=${page}`);
      const data = result.data || (Array.isArray(result) ? result : []);
      
      setBars(data);
      setPages({
        page: result.page || 1,
        totalPages: result.totalPages || 1,
      });
      setArrowHovered(Array(data.length).fill(false));
    } catch (error) {
      console.error('Failed to fetch bar collection:', error);
    }
  }, [setBars]);

  // 刪除處理
  const handleDelete = async (saveId) => {
    if (interactingItems.current.has(`delete-${saveId}`)) return;
    interactingItems.current.add(`delete-${saveId}`);

    try {
      const result = await AccountService.collectBar.delete(saveId);
      if (result && result.action === 'remove') {
        customToast.success('刪除收藏成功');
        setBars((prev) => prev.filter((b) => b.save_id !== saveId));
        refreshCollectList();
      }
    } catch (error) {
      console.error('Failed to delete bar:', error);
      customToast.error('刪除失敗');
    } finally {
      interactingItems.current.delete(`delete-${saveId}`);
    }
  };

  // 箭頭動畫處理
  const handleArrowHover = (index, isHovered) => {
    setArrowHovered((prev) => {
      const next = [...prev];
      next[index] = isHovered;
      return next;
    });
  };

  return (
    <CollectionView
      radio="酒吧"
      items={bars}
      pages={pages}
      onFetchData={fetchData}
      emptyItemType="酒吧"
      emptyLinkPath="/bar"
      onPageChange={onPageChange}
      renderItem={(bar, i) => (
        <BarCollectCard
          key={bar.save_id || i}
          bar={bar}
          index={i}
          arrowHovered={arrowHovered}
          onArrowHover={handleArrowHover}
          onDelete={handleDelete}
        />
      )}
    />
  );
}
