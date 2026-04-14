import { useState, useCallback, useRef } from 'react';
import CollectionView from '@/components/account-center/collection-view';
import PostCollectCard from '@/components/account-center/collect-list/post-collect-card';
import { AccountService } from '@/services/account-service';
import { usePostContext } from '@/context/post-context';
import { useCollect } from '@/context/use-collect';
import { toast as customToast } from '@/lib/toast';
import PostModal from '@/components/community/modal/postModal';

export default function AccountCollectPost({ onPageChange }) {
  const { posts, setPosts, checkPostsStatus, getPostComments, postModalToggle, setPostModalToggle } = usePostContext();
  const { p, setP, modalId, setModalId, refreshCollectList } = useCollect();
  
  const [pages, setPages] = useState({ page: 1, totalPages: 1 });
  const [arrowHovered, setArrowHovered] = useState([]);
  const interactingItems = useRef(new Set());

  // 資料抓取邏輯
  const fetchData = useCallback(async (sid, page) => {
    try {
      const result = await AccountService.collectPost.get(sid, `?page=${page}`);
      const data = result.data || (Array.isArray(result) ? result : []);
      
      if (data.length > 0) {
        const postIds = data.map((post) => post.post_id).join(',');
        await checkPostsStatus(postIds);
        await getPostComments(postIds);
        setPosts(data);
      } else {
        setPosts([]);
      }
      
      setPages({
        page: result.page || 1,
        totalPages: result.totalPages || 1,
      });
      setArrowHovered(Array(data.length).fill(false));
    } catch (error) {
      console.error('Failed to fetch post collection:', error);
    }
  }, [setPosts, checkPostsStatus, getPostComments]);

  // 刪除處理
  const handleDelete = async (saveId) => {
    if (interactingItems.current.has(`delete-${saveId}`)) return;
    interactingItems.current.add(`delete-${saveId}`);

    try {
      const result = await AccountService.collectPost.delete(saveId);
      if (result && result.action === 'remove') {
        customToast.success('刪除收藏成功');
        setPosts((prev) => prev.filter((p) => p.save_id !== saveId));
        refreshCollectList();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      customToast.error('刪除失敗');
    } finally {
      interactingItems.current.delete(`delete-${saveId}`);
    }
  };

  // 貼文點擊處理
  const handlePostClick = (post, modalId) => {
    setPostModalToggle(modalId);
    setP(post);
    setModalId(modalId);
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
    <>
      <CollectionView
        radio="貼文"
        items={posts}
        pages={pages}
        onFetchData={fetchData}
        emptyItemType="貼文"
        emptyLinkPath="/community"
        loaderType="post"
        onPageChange={onPageChange}
        renderItem={(post, i) => (
          <PostCollectCard
            key={post.save_id || i}
            post={post}
            index={i}
            arrowHovered={arrowHovered}
            onArrowHover={handleArrowHover}
            onDelete={handleDelete}
            onPostClick={handlePostClick}
          />
        )}
      />
      <PostModal
        className="z-[100]"
        post={p}
        modalId={modalId}
        isOpen={postModalToggle === modalId}
      />
    </>
  );
}
