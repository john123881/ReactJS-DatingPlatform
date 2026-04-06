import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PostCardMedium from '@/components/community/card/postCardMedium';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Explore({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { 
    randomPosts, 
    exploreHasMore, 
    getCommunityExplorePost, 
    resetExplorePosts,
    loadingPosts 
  } = usePostContext();

  useEffect(() => {
    if (auth?.id !== undefined && auth?.id !== null && randomPosts.length === 0 && !loadingPosts) {
      if (getCommunityExplorePost) getCommunityExplorePost();
    }
    // Cleanup: Reset posts when leaving the page to ensure randomization on next visit
    return () => {
      if (resetExplorePosts) resetExplorePosts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id]); // 只相依於 auth.id，內部邏輯會處理其餘狀態去防止重複請求

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center pt-10">
        <div className="flex flex-wrap gap-5 justify-center">
          <InfiniteScroll
            dataLength={randomPosts.length}
            next={getCommunityExplorePost}
            hasMore={exploreHasMore}
            loader={<PageLoader type="index" minHeight="200px" />}
            // endMessage={<p>No more posts</p>}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              gap: '1.25rem',
            }}
          >
            {randomPosts.map((post, i) => (
              <PostCardMedium post={post} key={i} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

Explore.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
