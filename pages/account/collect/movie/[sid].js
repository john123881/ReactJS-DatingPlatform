import { useState, useCallback } from 'react';
import CollectionView from '@/components/account-center/collection-view';
import MovieCollectCard from '@/components/account-center/collect-list/movie-collect-card';
import { AccountService } from '@/services/account-service';
import { useCollect } from '@/context/use-collect';
import { toast as customToast } from '@/lib/toast';

export default function AccountCollectMovie({ onPageChange }) {
  const { movies, setMovies } = useCollect();
  const [pages, setPages] = useState({ page: 1, totalPages: 1 });
  const [arrowHovered, setArrowHovered] = useState([]);

  // 資料抓取邏輯
  const fetchData = useCallback(async (sid, page) => {
    try {
      const result = await AccountService.collectMovie.get(sid, `?page=${page}`);
      const data = result.data || (Array.isArray(result) ? result : []);
      
      setMovies(data);
      setPages({
        page: result.page || 1,
        totalPages: result.totalPages || 1,
      });
      setArrowHovered(Array(data.length).fill(false));
    } catch (error) {
      console.error('Failed to fetch movie collection:', error);
    }
  }, [setMovies]);

  // 刪除處理
  const handleDelete = async (saveId) => {
    const result = await AccountService.collectMovie.delete(saveId);
    if (result && result.action === 'remove') {
      customToast.success('刪除收藏成功');
      setMovies((prev) => prev.filter((m) => m.save_id !== saveId));
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
      radio="電影"
      items={movies}
      pages={pages}
      onFetchData={fetchData}
      emptyItemType="電影"
      emptyLinkPath="/booking"
      onPageChange={onPageChange}
      renderItem={(movie, i) => (
        <MovieCollectCard
          key={movie.save_id || i}
          movie={movie}
          index={i}
          arrowHovered={arrowHovered}
          onArrowHover={handleArrowHover}
          onDelete={handleDelete}
        />
      )}
    />
  );
}
